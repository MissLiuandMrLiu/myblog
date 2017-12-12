/**
 * Created by My love on 2017/12/11.
 */
var mongodb = require('./db')
//创建一个构造函数,命名为User,里面有username,password,email分别存储用户名,密码,邮箱
function User(user) {
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
}
module.exports = User

User.prototype.save = function(callback){
    var user = {
        username:this.username,
        password:this.password,
        email:this.email
    };
    //通过open方法打开数据库
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
            //将用户数据插入users集合当中去.
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user[0]);//成功的话返回用户名
            })
        })
    })
}
//读取用户的信息
User.get = function(username,callback){
    //打开数据库
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
            //查询用户名(name)的文档
            collection.findOne({username:username},function(err,user){
                if(err){
                    return callback(err);
                }
                return callback(null,user);//成功返回查询的用户信息
            })

        })
    })
}