"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_routes_1 = require("../modules/admin/admin.routes");
const analytics_routes_1 = require("../modules/analytics/analytics.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const brand_routes_1 = require("../modules/brand/brand.routes");
const cart_routes_1 = require("../modules/cart/cart.routes");
const category_routes_1 = require("../modules/category/category.routes");
const chat_routes_1 = require("../modules/chat/chat.routes");
const emiratesId_routes_1 = require("../modules/emiratesId/emiratesId.routes");
const notification_routes_1 = require("../modules/notification/notification.routes");
const order_routes_1 = require("../modules/order/order.routes");
const part_routes_1 = require("../modules/part/part.routes");
const review_routes_1 = require("../modules/review/review.routes");
const seller_routes_1 = require("../modules/seller/seller.routes");
const shopLicense_routes_1 = require("../modules/shopLicense/shopLicense.routes");
const subCategory_routes_1 = require("../modules/subCategory/subCategory.routes");
const user_routes_1 = require("../modules/user/user.routes");
const vehicleModel_routes_1 = require("../modules/vehicleModel/vehicleModel.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/seller",
        route: seller_routes_1.SellerRoutes,
    },
    {
        path: "/admin",
        route: admin_routes_1.AdminRoutes,
    },
    {
        path: "/part",
        route: part_routes_1.PartRoutes,
    },
    {
        path: "/category",
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: "/sub-category",
        route: subCategory_routes_1.SubCategoryRoutes,
    },
    {
        path: "/brand",
        route: brand_routes_1.BrandRoutes,
    },
    {
        path: "/vehicle-model",
        route: vehicleModel_routes_1.VehicleModelRoutes,
    },
    {
        path: "/cart",
        route: cart_routes_1.CartRoutes,
    },
    {
        path: "/order",
        route: order_routes_1.OrderRoutes,
    },
    {
        path: "/review",
        route: review_routes_1.ReviewRoutes,
    },
    {
        path: "/chat",
        route: chat_routes_1.ChatRoutes,
    },
    {
        path: "/emirates-id",
        route: emiratesId_routes_1.EmiratesIdRoutes,
    },
    {
        path: "/shop-license",
        route: shopLicense_routes_1.ShopLicenseRoutes,
    },
    {
        path: "/analytics",
        route: analytics_routes_1.AnalyticsRoutes,
    },
    {
        path: "/notification",
        route: notification_routes_1.NotificationRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
