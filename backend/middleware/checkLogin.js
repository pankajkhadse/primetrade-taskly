import jwt from 'jsonwebtoken'

 const checkLogin = (req , res, next) =>{
    
   const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
     if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided!" });}

         try {
        // 2. Verify the token using your Secret Key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Add the user data (payload) to the request object
        req.user = verified; 
        console.log(req.user)
        
        next(); // Move to the next function (the controller)
    } catch (err) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
    }

    export default  checkLogin;