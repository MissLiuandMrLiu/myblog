/**
 * Created by hama on 2017/12/11.
 */
//连接数据库的实例
var mongodb = require('./db');
//创建一个构造函数，命令为User,里面的username,password,email分别
//存储用户名、密码和邮箱.
function User(user){
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
}
User.prototype.save = function(callback){
    //收集即将存入数据库的数据
    var user = {
        username:this.username,
        password:this.password,
        email:this.email
    }
    //打开数据库
    mongodb.open(function(err,db){
        //如果在打开数据库的时候发生错误，将错误结果返回给回调.
        if(err){
            return callback(err);
        }
        //读取users集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //将数据插入到users集合里面去
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user);//User是一个注册成功后的返回对象，里面包含了查询的相关信息。
            })
        })
    })
}
User.get = function(username,callback){
    //1.打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取users集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查询出name为指定用户名的用户信息，将结果返回
            collection.findOne({username:username},function(err,user){
                mongodb.close();//关掉数据库
                if(err){
                    return callback(err);
                }
                return callback(null,user);
            })
        })
    })
}
module.exports = User



