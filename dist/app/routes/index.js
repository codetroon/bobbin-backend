"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const category_route_1 = require("../modules/category/category.route");
const contactMessage_routes_1 = require("../modules/contactMessage/contactMessage.routes");
const hero_route_1 = require("../modules/hero/hero.route");
const order_route_1 = require("../modules/order/order.route");
const product_route_1 = require("../modules/product/product.route");
const size_route_1 = require("../modules/size/size.route");
const sizeGuide_routes_1 = require("../modules/sizeGuide/sizeGuide.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/products",
        route: product_route_1.ProductRoutes,
    },
    {
        path: "/categories",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/sizes",
        route: size_route_1.SizeRoutes,
    },
    {
        path: "/size-guides",
        route: sizeGuide_routes_1.SizeGuideRoutes,
    },
    {
        path: "/orders",
        route: order_route_1.OrderRoutes,
    },
    {
        path: "/hero",
        route: hero_route_1.HeroRoutes,
    },
    {
        path: "/contact-messages",
        route: contactMessage_routes_1.ContactMessageRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
