const pool=require("../config/mysql");
const Func=require("./Function");

class Mysql{
    getInsetSql(Table,HashTable){
        let columns="",values="";
        for(let key in HashTable){
            columns+=key+",";
            let val=HashTable[key];
            if(typeof val =="string") val=`'${val}'`;
            values+=val+",";
        }
        columns=Func.trim(columns,",");
        values=Func.trim(values,",");
        return `insert into ${Table}(${columns}) values(${values})`;
    }
    getDeleteSql(Table,Filter){
        return `delete from ${Table} where 1=1 ${Filter}`;
    }
    getUpdateSql(Table,HashTable,Filter){
        let sets="";
        for(let key in HashTable){
            let val=HashTable[key];
            if(typeof val =="string") val=`'${val}'`;
            sets+=`${key}=${val},`;
        }
        sets=Func.trim(sets,",");
        return `update ${Table} set ${sets} where 1=1 ${Filter}`;
    }
}

const query=function(sql){
    return new Promise((resolve,reject)=>{
        pool.query(sql,(err,result)=>{
            err?reject(err):resolve(result);
        });
    });
}

exports.query=query;
exports.addData=function(Table,HashTable){
    return new Promise((resolve,reject)=>{
        let Sql=new Mysql();
        let sql=Sql.getInsetSql(Table,HashTable);
        query(sql).then(result=>{
            let id=result;
            if(isNaN(id)&&id>0){
                resolve(id);
            }else{
                let err=new Error("插入语句影响行数为0");
                reject(err);
            }
        }).catch(err=>{
            reject(err);
        });
    });
}
exports.delDate=function(Table,Filter){
    return new Promise((resolve,reject)=>{
        let Sql=new Mysql();
        let sql=Sql.getDeleteSql(Table,Filter);
        query(sql).then(result=>{
            let affectedRows=result.affectedRows;
            if(affectedRows>0){
                resolve(affectedRows);
            }else{
                let err=new Error(`删除语句影响行数为${affectedRows}`);
                reject(err);
            }
        }).catch(err=>{
            reject(err);
        });
    });
}
exports.update=function(Table,HashTable,Filter){
    return new Promise((resolve,reject)=>{
        let Sql=new Mysql();
        let sql=Sql.getUpdateSql(Table,HashTable,Filter);
        query(sql).then(result=>{
            let affectedRows=result.affectedRows;
            if(affectedRows>0){
                resolve(affectedRows);
            }else{
                let err=new Error(`删除语句影响行数为${affectedRows}`);
                reject(err);
            } 
        }).catch(err=>{
            reject(err);
        });
    });
}