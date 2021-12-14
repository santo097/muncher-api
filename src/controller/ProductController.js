"use strict";
const querystring = require("querystring");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET ALL PRODUCTS

module.exports.getProducts = async (event) => {
    const Products = await prisma.product.findMany();
    if(Products){
      return {
        statusCode: 200,
        body: JSON.stringify(
        {
            message: "Lista de productos",
            Products
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
            message: "No hay productos registrados",
        },
        null,
        2
        ),
    };
    }
};

// GET PRODUCTS BY ID

module.exports.getProductById = async (event) => {
    const getProduct = await prisma.product.findUnique({
      where:{id:Number(event.pathParameters.id)}
    })
    if(getProduct){
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message:"Confirmado",
            getProduct
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
            message:"No se encuentra el registro",
          },
          null,
          2
        ),
      };
    }
  };

// ADD PRODUCTS

module.exports.CreateProduct = async(event) => {
    const body = querystring.parse(event["body"]);
    const getProduct = await prisma.product.findMany({
      where:{name:body.name}
    });
    if(!getProduct){
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            message:"El registro ya existe",
          },
          null,
          2
        ),
      };
    }
    else{
      const data = {
        name:body.name,
        amount: Number(body.amount),
        price: Number(body.price),
        state: body.state
      }
      const product = await prisma.product.create({data:data})
      // .then(products =>{
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              message:"Confirmado",
              product
            },
            null,
            2
          ),
        };
    }
  };

// UPDATE PRODUCT

module.exports.UpdateProduct = async (event) => {
    const request = querystring.parse(event["body"]);
    const getProduct = await prisma.product.findUnique({
      where:{id:Number(event.pathParameters.id)}
    })
    if(getProduct){
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
            message:"Confirmado",
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
            message:"No se encuentra registros",
          },
          null,
          2
        ),
      };
    }
  };

// DELETE PRODUCT BY ID

  module.exports.DeleteProduct = async (event) => {
    const getProduct = await prisma.product.findUnique({
      where:{id:Number(event.pathParameters.id)}
    })
    if(getProduct){
      const deleteUser = await prisma.product.delete({
        where: {
          id: Number(event.pathParameters.id),
        },
      })
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message:"Confirmado",
            deleteUser
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
            message:"No se encuentran registros",
          },
          null,
          2
        ),
      };
    }
  };