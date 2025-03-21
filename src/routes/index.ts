import postsRoutes from './post';
import commentsRoutes from './comment';
import authRoutes from './auth';
import file_routes from './file_routes';
import { Express } from 'express';

const routes = (app: Express) => {
	
    app.use("/api/posts", postsRoutes);
    app.use("/api/comments", commentsRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/file", file_routes);
};

export default routes;