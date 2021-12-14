"use strict";
const querystring = require("querystring");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET ALL ORDERS

module.exports.getOrders = async (event) => {
  const Order = await prisma.order.findMany();
  if(!Order){
    return {
      statusCode: 404,
      body: JSON.stringify(
      {
          message: "PRODUCTS NOT FOUND",
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
          message: "PRODUCTS",
          Order
      },
      null,
      2
      ),
  };
  }
};

// GET ORDER BY ID

module.exports.getOrderById = async (event) => {
  const getUserById = await prisma.user.findUnique({
    where:{id:Number(event.pathParameters.id)}
  });
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
    const getOrderById = await prisma.order.findUnique({
      where:{id_user:getUserById.id}
    });
    if(!getOrderById){
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            message:"ORDER NOT FOUND",
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
            message:"CONFIRMED",
            getOrderById
          },
          null,
          2
        ),
      };
    }
  }

};

// ADD ORDER

module.exports.CreateOrder = async(event) => {
  const UserByID = await prisma.user.findUnique({
    where:{id:Number(event.pathParameters.id)}
  })
  if(!UserByID){
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
    const body = querystring.parse(event["body"]);
    const getProductById = await prisma.product.findUnique({
      where:{name: body.product}
    });
    if(!getProductById){
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
      const Pricetotal = Number(getProductById.price) * Number(body.amount);
      const Balance = Number(UserByID.Balance) - Pricetotal;
      if(UserByID.Balance < Pricetotal){
        return {
          statusCode: 404,
          body: JSON.stringify(
            {
              message:"NOT MONEY",
            },
            null,
            2
          ),
        };
      }
      else{
        const data = {
          product:body.product,
          amount:Number(body.amount),
          priceTotal:Pricetotal,
          unitPrice:Number(getProductById.price),
          id_user: Number(event.pathParameters.id),
        }
        const UpdateBalance = await prisma.user.update({
          where:{id:Number(event.pathParameters.id)},
          data:{Balance:Balance}
        })
        const order = await prisma.order.create({data:data});
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              message:"CONFIRMED",
              order
            },
            null,
            2
          ),
        };
      }
    }
  }
};

// UPDATE ORDER

module.exports.UpdateOrder = async (event) => {
  const request = querystring.parse(event["body"]);
  const getOrder = await prisma.order.findUnique({
    where:{id:Number(event.pathParameters.id)}
  })
  if(getOrder){
    const data = {
      name:body.name,
      amount: Number(body.amount),
      state: body.state
    }
    const updateProduct = await prisma.product.update({
      where: {
        id: Number(event.pathParameters.id),
      },
      data: data,
    })
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message:"CONFIRMED",
          data,
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
          message:"ORDER NOT FOUND",
        },
        null,
        2
      ),
    };
  }
};

