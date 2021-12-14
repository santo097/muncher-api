"use strict";
const querystring = require("querystring");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// GET ALL USERS

module.exports.getUsers = async (event) => {
  const User = await prisma.user.findMany();
  if(User){
    return {
      statusCode: 200,
      body: JSON.stringify(
      {
          message: "PRODUCTS",
          User
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
          message: "NO PRODUCTS",
      },
      null,
      2
      ),
  };
  }
};

// SEARCH BY ID

module.exports.getUserById = async (event) => {
  const getUserById = await prisma.user.findUnique({
    where:{id:Number(event.pathParameters.id)}
  })
  if(getUserById){
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message:"CONFIRMED",
          getUserById
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
          message:"NO USERS",
        },
        null,
        2
      ),
    };
  }
};

// ADD PRODUCT

module.exports.CreateUser = async(event) => {
  const body = querystring.parse(event["body"]);
  const getUser = await prisma.user.findMany({
    where:{email:body.email}
  })
  if(getUser === []){
    return {
      statusCode: 404,
      body: JSON.stringify(
        {
          message:"USER ALREADY EXIST",
        },
        null,
        2
      ),
    };
  }
  else{
    const contraseña = bcrypt.hash(body.password, 12, (err,hash) =>{console.log(hash)});
    const data = {
      name:body.name,
      email:body.email,
      Balance: Number(body.Balance),
      password: bcrypt.hashSync(body.password, 8)
    }

    const user = await prisma.user.create({data:data})
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message:"CONFIRMED",
          user
        },
        null,
        2
      ),
    };
  }
};

// DELETE USERS

module.exports.DeleteUser = async (event) => {
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
    const deleteUser = await prisma.user.delete({
      where: {
        email: {id:Number(event.pathParameters.id)},
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message:"USER DELETED",
        },
        null,
        2
      ),
    };
  }
};

// LOGIN

module.exports.Login = async (event) =>{
  const body = querystring.parse(event["body"]);
  const User = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })
  if(!User){
    return{
      statusCode:404,
      body:JSON.stringify(
        {
        message: "EMAIL NOT FOUND"
        },
        null,
        2
        )
    };
  }
  else{
    const passwordisValid = bcrypt.compareSync(body.password,User.password);
    if(!passwordisValid){
      return{
        statusCode:401,
        body:JSON.stringify(
          {
          message: "PASSWORD INCORRECT"
          },
          null,
          2
          )
      };
    }
    else{
      return {
        statusCode: 200,
        body: JSON.stringify(
        {
            message: "SESION BEGINS",
        },
        null,
        2
        ),
    };
    }
  }
}

// ADD BALANCE

module.exports.AddBalance = async (event) =>{
  const User = await prisma.user.findUnique({
    where:{id:Number(event.pathParameters.id)}
  });
  if(!User){
    return {
      statusCode: 404,
      body: JSON.stringify(
      {
          message: "USER NO EXIST",
      },
      null,
      2
      ),
  };
  }
  else{
    const body = querystring.parse(event["body"]);
    const AddBalance = Number(User.Balance) + Number(body.Balance);
    const UpdateBalance = await prisma.user.update({
      where:{id:Number(event.pathParameters.id)},
      data:{Balance:AddBalance}
    })
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message:"CONFIRMED",
          UpdateBalance
        },
        null,
        2
      ),
    };
  }
}