/**
 * Created by hama on 2017/12/12.
 */
var mongodb = require('./db');
//引入markdown
var markdown = require('markdown').markdown
function Post(name,title,content){
    this.name = name;
    this.title = title;
    this.content = content;
}
//格式化时间的函数
function formatDate(num){
    return num < 10 ? '0' + num : num
}
Post.prototype.save = function(callback){
    //1.格式化时间
    var date = new Date();
    var now = date.getFullYear() + '-' + formatDate(date.getMonth() + 1) + '-' + formatDate(date.getDate()) + ' ' + formatDate(date.getHours()) + ':' + formatDate(date.getMinutes()) + ':' + formatDate(date.getSeconds());
    //2.收集数据
    var newContent = {
        name:this.name,
        title:this.title,
        content:this.content,
        time:now,
        //添加一个留言的字段
        comments:[]
    }
    //3.打开数据库
    //4.读取posts集合
    //5.将数据插入到集合中，并且跳转到首页.
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(newContent,function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
Post.getAll = function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {}
            if(name){
                query.name = name;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                //将每篇文章在读取的时候以markdown的格式进行解析
                docs.forEach(function(doc){
                    doc.content = markdown.toHTML(doc.content);
                })
                return callback(null,docs);
            })
        })
    })
}
//获取一篇文章
Post.getOne = function(name,title,time,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name:name,
                title:title,
                time:time
            },function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                if(err){
                    //markdown解析文章的内容
                    doc.content = markdown.toHTML(doc.content);
                    //留言的内容也要通过markdown来进行解析
                    doc.comments.forEach(function(comment){
                        comment.content = markdown.toHTML(comment.content)
                    })
                }
                return callback(null,doc);
            })
        })
    })
}
//编辑
Post.edit = function(name,title,time,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name:name,
                title:title,
                time:time
            },function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
Post.update = function(name,title,time,content,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                name:name,
                title:title,
                time:time
            },{
                $set:{content:content}
            },function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
//删除
Post.remove = function(name,title,time,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                name:name,
                title:title,
                time:time
            },{
                w:1
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}
module.exports = Post