export const captureRequestInfo = (req, res, next) => {
    req.auditInfo = {
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        platformInfo: req.headers['sec-ch-ua-platform']
    };
    next();
};