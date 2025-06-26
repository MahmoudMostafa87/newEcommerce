const winston=require("winston");
const logger=winston.createLogger({
    transports:[
        new winston.transports.File({
            filename:"logging.log",
            level:"info"
        }),
        new winston.transports.File({ 
            filename: `errors.log`, 
            level: 'error' 
          })

    ],
    exceptionHandlers:[
        new winston.transports.File({filename:"exception.log"}),
    ],
    rejectionHandlers:[
        new winston.transports.File({filename:"rejection.log"}),
    ]
})




module.exports=logger;