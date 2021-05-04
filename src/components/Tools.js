export const showMessage=(ruta)=>{
    const $message=document.getElementById(ruta);
        $message.classList.toggle("note-active");
        setTimeout(()=>{
            $message.classList.toggle("note-active");
        },2000);
}
export const methodCreate= async (url,form,axios,reqError,reqSuccess)=>{
    try{
        const res=await axios.post(url, form);
        const json= await res.data;
        if(json.error){
            reqError(json.error);
        }else{
            reqSuccess();
        }

    }catch(err){
         reqError(err);
    }
}
export const methodGet=async (url,axios,reqError,reqSuccess)=>{
try{
    const res= await axios.get(url);
    const json= await res.data;
    if(json.error){
        reqError(json.error);
    }else{
        reqSuccess(json);
    }
}catch(err){
    reqError(err)
}
}
export const methodDelete= async (url,axios,reqError,reqSuccess)=>{
    try{
        const res= await axios.delete(url);
        const json= await res.data;
        
        if(json.error){
            
            reqError(json.error);
        }else{
            
            reqSuccess(json.message);
        }
    }catch(err){
        
        reqError(err);
    }
}
export const methodUpdate= async (url,form,axios,reqError,reqSuccess)=>{
    try{
        const res= await axios.put(url,form);
        const json= await res.data;
        if(json.error){
            reqError(json.error);
        }else{
            reqSuccess(json.message);
        }
    }catch(err){
        reqError(err);
    }
}