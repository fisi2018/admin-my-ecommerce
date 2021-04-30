import { useState,useEffect } from "react";
import axios from "axios";
import Modal from '@material-ui/core/Modal';
import {API} from "../config";
import AddIcon from '@material-ui/icons/Add';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Remove';
import "./Categorias.css";
import "./Productos.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import { FormatColorFill, Input } from "@material-ui/icons";
export default function Productos(){
    const [productos,setProductos]=useState([]);
    const [open,setOpen]=useState(false);
    const [edit,setEdit]=useState({});
    const [list, setList]=useState({});
    const[formColor, setFormColor]=useState({});
    const [formEdit,setFormEdit]=useState({});
    const [error,setError]=useState({
        new:false,
        err:""
    });
    const[isSubmit,setIsSubmit]=useState({
        bool:false,
        deleted:{}
    });
    const showMessage=()=>{
         const $message=document.getElementById("message-delete");
        $message.classList.toggle("note-active");
        setTimeout(()=>{
            $message.classList.toggle("note-active");
            setIsSubmit({
                bool:false,
                deleted:""
            });
            setError({
                new:false,
                err:""
            })
        },2000);
    }
    const getProductos= async ()=>{
        try{
            const res=await axios.get(`${API}/producto/products`);
            const json= await res.data;
            if(json.error){
                setError({
                    new:true,
                    err:json.error
                });
                setIsSubmit({
                    bool:true
                });
                showMessage();
            }
            else{
                setProductos(json);
            }
        }catch(err){
            setError({
                new:true,
                err
            });
            setIsSubmit({
                bool:true
            });
            showMessage();
        }
    }
    useEffect(()=>{
        getProductos();
    },[]);
    useEffect(()=>{
        getProductos();
    },[isSubmit]);
    useEffect(()=>{
        getProductos();
    },[edit]);
    useEffect(()=>{
        if(!open){
            getProductos();
        }
    },[open]);
    const eliminar= async (id)=>{
        try{
            const res=await axios.delete(`${API}/producto/${id}`);
            const json= await res.data;
            if(json.error){
                setError({
                    new:true,
                    err:json.error
                });
                setIsSubmit({
                    bool:true
                });
                showMessage();
            }else{
                setIsSubmit({
                    bool:true,
                    deleted:json.message
                });
                showMessage();
            }

        }catch(err){
            setError({
                new:true,
                err
            });
            setIsSubmit({
                bool:true
            });
            showMessage();
        }
    }
    const handleChange=(e)=>{
        setFormEdit({
            ...formEdit,
            [e.target.name]:e.target.value
        })
    }
    const actualizarProducto=async(id)=>{
        const url=`${API}/producto/update`;
        let obj=formEdit;
        obj={
            ...obj,
            id
        }
        let res= await axios.put(url,obj),
        json=await res.data;

        setEdit({...edit,
                [id]:false})
        
    }
   const deleteColor= async (color,id)=>{
       let array={};
        const url=`${API}/producto/updateColor`;
        let formImg= new FormData();
        let flag=0;
        productos.forEach((el)=>{
            if(el._id===id){
                
                el.colors.forEach((obj,index)=>{
                    if(obj.nameColor!==color){
                        const atributes={
                            nameColor:obj.nameColor,
                            codeColor:obj.codeColor,
                            imgColor:{
                                data:"",
                                contentType:""
                            }
                        }
                        let newIndex=index-flag;
                        array={
                            ...array,
                            [newIndex]:atributes
                        }
                        
                        formImg.set(newIndex.toString(),JSON.stringify(obj.imgColor));
                    }
                    else{
                        flag++;
                    }
                });
                
            }
            
        });
        formImg.set("colors",JSON.stringify(array));
        formImg.set("id",id);
        
        console.log(formImg, "ANTES DEL PUT");
        let res= await axios.put(url,formImg);
        console.log("DESPUES DE LA PETICION PUT");
        let json= await res.data;
        setEdit({
            colorEdited:true
        });
    }
    const actualizarColor= async (id)=>{
        const url=`${API}/producto/updateColor`;
        let formNewColor=new FormData();
        let list={
        };
        let count=0;
        productos.forEach((el)=>{
            if(el._id===id){
                el.colors.forEach((obj,index)=>{
                    const atributes={
                        codeColor:obj.codeColor,
                        nameColor:obj.nameColor,
                        imgColor:{
                            data:"",
                            contentType:""
                        }
                    }
                    list={
                        ...list,
                        [index]:atributes
                    }
                    formNewColor.set(index.toString(),JSON.stringify(obj.imgColor));
                    count++;
                });
            }
        });
        list={
            ...list,
            [count]:{
                codeColor:formColor.codeColor,
                nameColor:formColor.nameColor,
                imgColor:{
                    data:"",
                    contentType:""
                }
            }
        }
        formNewColor.set("isAdded","added");
        formNewColor.set(count.toString(),formColor.imgColor);
        formNewColor.set("colors",JSON.stringify(list));
        formNewColor.set("id",id);
        console.log(formNewColor,"FORM anres de put");
        console.log(list);
        console.log(formColor)
        let res= await axios.put(url,formNewColor);
        let json= await res.data;
        setOpen(false);
    }
    const handleActColor=(e)=>{
        if(e.target.name==="imgColor"){
            setFormColor({
                ...formColor,
                [e.target.name]:e.target.files[0]
            })
        }else{

            setFormColor({
                ...formColor,
                [e.target.name]:e.target.value
            })
        }
    }
    const body=(id)=>{
        return(
            <div className="modal-block">
                <h2>Agregar color</h2>
                <input name="nameColor" onChange={handleActColor} placeholder="Color" className="input-element small" type="text"/>
                <input onChange={handleActColor} name="imgColor" className="input-img" accept="img/*" type="file"/>
                <input onChange={handleActColor} name="codeColor" type="color"/>
                <button onClick={()=>actualizarColor(id)}>Actualizar</button>
            </div>
        )
    };
    return(
        <div className="categorias-block">
            <h1>Productos</h1>
            <ul className="categorias-container">
                <li className="category-element product-size">
                    <p>Nombre</p>
                    <p>Precio por mayor</p>
                    <p>Precio por menor</p>
                    <p>Categoria</p>
                    <p>Tallas</p>
                    <p>Acciones</p>

                </li>
                {productos.map((el)=>(
                    <>
                    <li key={el._id} className="category-element product-size">
                        <p>{el.name}</p>
                        {(!edit[el._id])?<p>{el.priceMayor}</p>
                        : <div>

                            <input name="priceMayor" onChange={handleChange} defaultValue={el.priceMayor} type="text" className="input-element small-product" />
                        </div>
                        }
                        {(!edit[el._id])?<p>{el.priceMenor}</p>
                        : <div>

                            <input onChange={handleChange} name="priceMenor" defaultValue={el.priceMenor} type="text" className="input-element small-product" />
                        </div>
                            }
                        <p>{el.category.name}</p>
                        {(!edit[el._id])?
                        <p>{el.sizes}</p>
                            : <div>

                                <input name="sizes" onChange={handleChange} defaultValue={el.sizes} className="input-element small-product" type="text" />
                            </div> 
                            }
                        
                        <div>
                        <button className="button-logout" name={el._id} onClick={
                            ()=>(list[el._id])?setList({
                                ...list,
                                [el._id]:false
                            }):setList({
                                ...list,
                                [el._id]:true
                            })
                        } >
                            <VisibilityIcon/><p>Ver detalles</p></button>
                        </div>
                        <div className="container-button">

                        <button className="button-logout" onClick={()=>eliminar(el._id)}>
                            <DeleteIcon/><p>Eliminar</p></button>
                        </div>
                    </li>
                    {list[el._id] && <div className="details-container row">
                                        <img className="img-element" src={`${API}/producto/img/${el._id}`} alt={el.name}/>
                                        <div className="description-block">

                                        <p>{el.description}</p>
                                        </div>
                                        <div className="edit-block">
                                        {(!edit[el._id])?<button className="button-logout" onClick={()=>setEdit({
                                            ...edit,
                                            [el._id]:true
                                        })} >
                                            <EditIcon/>
                                            <p>Editar</p></button>
                                        : <button className="button-logout" onClick={()=>actualizarProducto(el._id)} >
                                            <AutorenewIcon/>
                                            <p>Actualizar</p>
                                            </button> 
                                        }
                                        <button className="button-logout" onClick={()=>setOpen(true)}>
                                            <AddIcon/>
                                            <p>Agregar color</p>
                                            </button>
                                        <Modal 
                                        open={open}
                                        onClose={()=>setOpen(false)}
                                        style={{display:"flex",justifyContent:"center",alignItems:"center"}}
                                        >
                                            {body(el._id)}
                                        </Modal>
                                        </div>
                                        <ul className="ul-block">
                                            { el.colors.map((color)=>(
                                                <li className="list-color">
                                                    <p>{color.nameColor}</p>
                                                    <span className="color-circle" style={{backgroundColor:color.codeColor}} ></span>
                                                    <button className="button-delete" onClick={()=>deleteColor(color.nameColor,el._id)} >
                                                        <RemoveIcon style={{fontSize:15}} />
                                                    </button>
                                                </li>
                                            )) }
                                        </ul>
                            </div>}
                    </>
                ))}
            </ul>
             {isSubmit.bool && ((error.new)?<h2 className="error" id="message-delete"> {error.err}</h2>
            :<h2 className="note" id="message-delete"> {isSubmit.deleted} </h2>)}
        </div>
    )
}