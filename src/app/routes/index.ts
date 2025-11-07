import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ContactMessageRoutes } from "../modules/contactMessage/contactMessage.routes";
import { HeroRoutes } from "../modules/hero/hero.route";
import { OrderRoutes } from "../modules/order/order.route";
import { ProductRoutes } from "../modules/product/product.route";
import { SizeRoutes } from "../modules/size/size.route";
import { SizeGuideRoutes } from "../modules/sizeGuide/sizeGuide.routes";

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
    path: "/size-guides",
    route: SizeGuideRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/hero",
    route: HeroRoutes,
  },
  {
    path: "/contact-messages",
    route: ContactMessageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
