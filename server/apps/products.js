import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();
// 1. เลือกชื่อ collection ข้อมูลที่จะไปทำงาน (MongoDB จะเก็บข้อมูลเป็น collections)
// const collection = db.collection("products");
// ใช่ .ObjectId สร้างparam เพื่อดูการอัพเดท
// const productId = ObjectId(req.params.productId);

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const page = req.query.page;
  const limit = req.query.limit;
  const products = await collection
    .aggregate([
      { $skip: Number(limit) * page },
      { $limit: Number(req.query.limit) },
    ])
    .toArray();
  // const products = await collection.find({}).limit(10).toArray();

  return res.json({ data: products });
});

productRouter.get("/:id", (req, res) => {});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  // 2. เพิ่มข้อมูลลง database โดยใช้คำสั่ง .insertOne
  try {
    const productData = { ...req.body };
    const products = await collection.insertOne(productData);
    // 3. return response กลับไปหา Client
    return res.json({
      message: `Product has (${products.productId}) been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `ERROR`,
    });
  }
});

productRouter.put("/:productId", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.productId);
  const newProductData = { ...req.body };
  await collection.updateOne(
    {
      _id: productId,
    },
    {
      $set: newProductData,
    }
  );
  return res.json({
    message: `Product item (${productId}) has been updated successfully`,
  });
});

productRouter.delete("/:productId", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.productId);
  // console.log(productId);

  await collection.deleteOne({
    _id: productId,
  });
  return res.json({
    message: `Product item (${productId}) has been deleted successfully`,
  });
});

export default productRouter;
