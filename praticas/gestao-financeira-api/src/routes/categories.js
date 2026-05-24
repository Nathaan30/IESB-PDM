import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/categorySchema.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayName: "asc" },
    });

    return res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = createCategorySchema.parse(req.body);

    const category = await prisma.category.create({
      data,
    });

    return res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = updateCategorySchema.parse(req.body);

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });

    return res.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.category.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Categoria não encontrada",
      });
    }

    if (existing.isDefault) {
      return res.status(400).json({
        error: "Categorias padrão não podem ser excluídas",
      });
    }

    await prisma.category.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;