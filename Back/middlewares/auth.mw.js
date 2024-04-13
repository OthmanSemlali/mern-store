const requireRole = (allowedRoles) => {
    return (req, res, next) => {
      if (req.user && allowedRoles.includes(req.user.role)) {
        console.log("req.user.role from mw: ", req.user.role);
        next();
      } else {
        res.status(403).json({
          error: `Forbidden: Only users with role '${allowedRoles.join(', ')}' can make this request`,
        });
      }
    };
  };

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    // res.redirect("/login");
    res.sendStatus(401)
}

//restrict user from send request for loging while he already logged!
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        // return res.redirect("/dashboard");

        return res.json({error: "Unautorized (you must be logged out to perform such an operation)"})
    }
    next();
}
module.exports = {requireRole, checkAuthenticated, checkNotAuthenticated}