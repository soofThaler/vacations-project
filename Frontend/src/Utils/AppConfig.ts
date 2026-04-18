class AppConfig {
    // Auth routes for user registration and login
    public readonly registerUrl = "http://localhost:4000/api/register/";
    public readonly loginUrl = "http://localhost:4000/api/login/";

    // Main route for vacations (CRUD operations)
    public readonly vacationsUrl = "http://localhost:4000/api/vacations/";

    // Route for serving vacation images
    public readonly imagesUrl = "http://localhost:4000/api/vacations/images/";

    // Route for handling user likes
    public readonly likesUrl = "http://localhost:4000/api/likes/";

    // AI recommendation route
    public readonly aiRecommendationUrl = "http://localhost:4000/api/vacations/ai/recommendation/";

    // MCP chat & SSE routes
    public readonly chatUrl = "http://localhost:4000/api/chat";
    public readonly sseUrl = "http://localhost:4000/sse";

    // Admin reports routes
    public readonly reportsDataUrl = "http://localhost:4000/api/vacations/reports/data";
    public readonly downloadCsvUrl = "http://localhost:4000/api/vacations/download/csv";
}

export const appConfig = new AppConfig();