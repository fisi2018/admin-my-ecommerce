export const showMessage=(ruta)=>{
    const $message=document.getElementById(ruta);
        $message.classList.toggle("note-active");
        setTimeout(()=>{
            $message.classList.toggle("note-active");
            /*set1({
                bool:false,
                productMesage:false,
                contentMessage:false,
                colorMessage:false,
                added:{}
            });
            set2({
                new:false,
                err:""
            });*/
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