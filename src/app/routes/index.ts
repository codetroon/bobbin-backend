import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { HeroRoutes } from "../modules/hero/hero.route";
import { OrderRoutes } from "../modules/order/order.route";
import { ProductRoutes } from "../modules/product/product.route";
import { SizeRoutes } from "../modules/size/size.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/sizes",
    route: SizeRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/hero",
    route: HeroRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
