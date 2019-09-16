class Result {
    constructor(){
        this.success=false;
        this.message="";
        this.data=null;
    }
    getSuccess(){ return this.success; }
    setSuccess(success){ this.success=success; }
    getMessage(){ return this.message; }
    setMessage(message){ this.message=message; }
    getDate(){ return this.data; }
    setDate(data){ this.data=data; }
}

module.exports=Result;