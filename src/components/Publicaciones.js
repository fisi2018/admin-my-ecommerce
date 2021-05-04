import { useState,useEffect } from "react";
import axios from "axios";
import "./Categorias.css";
import "./Publicaciones.css";
import "./Productos.css";
import Loader from "./Loader";
import {API} from "../config";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {methodDelete, methodGet, showMessage} from "./Tools";
import DeleteIcon from '@material-ui/icons/Delete';
export default function Publicaciones(){
    const [error,setError]=useState({
        new:false,
        err:""
    });
    const [isSubmit,setIsSubmit ]=useState({
        bool:false,
        deleted:""
    });
    const [tables, setTables]=useState([]);
    const [loading,setLoading]= useState(true);
    const [list,setList]=useState({});
    const getPublicaciones=async ()=>{
        const url=`${API}/table/tables`;
        methodGet(url,axios,(err)=>{
            setError({new:true,err});
            setIsSubmit({bool:true});
            setLoading(false);
        },(json)=>{setTables(json);
        setLoading(false)});
    }
useEffect(()=>{
    getPublicaciones();
},[]);
useEffect(()=>{
    getPublicaciones();
    if(isSubmit.bool){
        showMessage("message-delete");
        setIsSubmit({...isSubmit,bool:false});
        setError({...error,new:false});
    }
},[isSubmit.bool]);
    const eliminar= (id)=>{
        const url=`${API}/table/${id}`;
        methodDelete(url,axios,(err)=>{
            setError({new:true,err});
            setIsSubmit({bool:true});
        },(message)=>setIsSubmit({bool:true,deleted:message}));
}

    return(
        <div className="categorias-block">
            <h1>Publicaciones</h1>
            <ul className="categorias-container" >
                <li className="category-element product-size" >
                    <p>Título</p>
                    <p>Tema</p>
                    <p>Acciones</p>
                </li>
                {tables.map((el)=>(
                    <>
                    <li key={el._id} className="category-element product-size">
                        <p>{el.title}</p>
                        <p>{el.category}</p>
                        <div className="container-button">
                        <button className="button-logout" onClick={
                            ()=>(list[el._id])?setList({
                                ...list,
                                [el._id]:false
                            }):setList({
                                ...list,
                                [el._id]:true
                            })
                        }>
                            <VisibilityIcon/>
                            <p>Ver detalles</p>
                        </button>

                        </div>
                        <div className="container-button">

                        <button  onClick={()=>eliminar(el._id)} className="button-logout">
                            <DeleteIcon/>
                            <p>Eliminar</p>
                        </button>
                        </div>
                    </li>
                    { list[el._id] && <div key={el._id} className="details-container row">
                        <img className="img-element" src={`${API}/table/img/${el._id}`} alt={el.name}/>
                                        <div className="description-block">

                                        <p>{el.description}</p>
                                        </div>
                    </div> }
                            </>
                ))}
            </ul>
            {loading && <Loader/> }
            {(error.new)?<h2 className="error" id="message-delete"> {error.err}</h2>
            :<h2 className="note" id="message-delete"> {isSubmit.deleted} </h2>}
        </div>
    )
}