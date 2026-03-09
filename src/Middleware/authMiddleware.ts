import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Get token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = verified; 
    
    next(); // Move to the actual route handler
  } catch (err) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};