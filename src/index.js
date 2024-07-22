const express = require('express');
// const {Auth}=require('./utils/common');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const rateLimit=require('express-rate-limit');
const {createProxyMiddleware} =require('http-proxy-middleware');
const app = express();

const limiter=rateLimit({
    windowMs:2*60*1000,
    max:3
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter);

app.use('/flightsService',createProxyMiddleware({target:ServerConfig.FLIGHT_SERVICE,changeOrigin:true,pathRewrite:{'^/flightsService' : '/'}} ));

app.use('/bookingService',createProxyMiddleware({target:ServerConfig.BOOKING_SERVICE,changeOrigin:true}));

app.use('/api', apiRoutes) ;
app.get('/home',(req,res)=>{
    return res.json({msg:'ok'});
});

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
 
});
