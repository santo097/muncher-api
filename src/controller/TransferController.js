"use strict";
const querystring = require("querystring");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET ALL TRANSFER

module.exports.getTransfers = async (event) => {
  const Transfer = await prisma.transfer.findMany();
  if(Transfer){
    return {
      statusCode: 200,
      body: JSON.stringify(
      {
          message: "TRANSFER",
          Transfer
      },
      null,
      2
      ),
  };
  }
  else{
    return {
      statusCode: 404,
      body: JSON.stringify(
      {
          message: "NOT TRANSFER",
      },
      null,
      2
      ),
  };
  }
};

// GET TRANSFER BY ID USER

module.exports.getTransferById = async (event) => {
  const UserTransfer = await prisma.user.findUnique({
    where:{id:Number(event.pathParameters.id)}
  });
  if(!UserTransfer){
    return {
      statusCode: 404,
      body: JSON.stringify(
        {
          message:"USER NOT EXISTS",
        },
        null,
        2
      ),
    };
  }
  else{
    const TransferById = await prisma.transfer.findMany({
      where:{id_userSend:Number(UserTransfer.id)}
    });
    if(!TransferById){
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            message:"NOT TRANSFER",
          },
          null,
          2
        ),
      };
    }
    else{
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message:"TRANSFER",
            TransferById
          },
          null,
          2
        ),
      };
    }
  }
};

// ADD TRANSFER BY ID USER

module.exports.CreateTransfer = async(event) => {
  const getUserById = await prisma.user.findUnique({
    where:{id:Number(event.pathParameters.id)}
  })
  if(!getUserById){
    return {
      statusCode: 404,
      body: JSON.stringify(
        {
          message:"USER NOT FOUND",
        },
        null,
        2
      ),
    };
  }
  else{
    const body = querystring.parse(event["body"]);
    const getUserIdReceived = await prisma.user.findUnique({
      where:{email:body.email}
    })
    if(!getUserIdReceived){
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            message:"USER NOT FOUND",
          },
          null,
          2
        ),
      };
    }
    else{
      if(getUserById.Balance <= 0){
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              message:"NOT MONEY"
            },
            null,
            2
          ),
        };
      }
      else{
        const Transfer = Number(body.Balance) + Number(getUserIdReceived.Balance);
        const Retiro =Number(getUserById.Balance) - Number(body.Balance);

        const RetiroTransfer = await prisma.user.update({
          where:{id:Number(event.pathParameters.id)},
          data:{Balance:Retiro}
        });

        const TransferMoney = await prisma.user.update({
          where:{email: getUserIdReceived.email},
          data:{Balance: Transfer}
        });
        const data = {
          numberTransfer:Number(event.pathParameters.id) + 100,
          amount: Number(body.Balance),
          id_userSend: Number(event.pathParameters.id),
          id_received: getUserIdReceived.id
        }

        const SaveTransfer = await prisma.transfer.create({data:data});
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              message: `CONFIRMED: TRANSFER ${body.Balance}`,
              data,
            },
            null,
            2
          ),
        };
      }
    }
  }
};

