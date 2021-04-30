import { useEffect,useState } from "react";
import axios from "axios";
import "./Categorias.css";
import {API} from "../config";
import DeleteIcon from '@material-ui/icons/Delete';
import {showMessage,methodGet, methodDelete} from "./Tools";
export default function Categorias(){
    const [categories,setCategories]=useState([]);
     const[isSubmit, setIsSubmit]=useState({
        bool:false,
        deleted:""
    });
    const[error,setError]=useState({
        new:false,
        err:""
    });
    const getCategories= async ()=>{
        const url=`${API}/category/categories`;
        methodGet(url,axios,(err)=>{
            setIsSubmit({bool:true});
            setError({new:true, err});
        },(json)=>setCategories(json))
        
    }
    useEffect(()=>{
        getCategories();
    },[]);
    useEffect(()=>{
        getCategories();
        if(isSubmit.bool){
            showMessage("messageDelete");
            setIsSubmit({
                bool:false,
                deleted:""
            });
            setError({
                new:false,
                err:""
            })
        }
    },[isSubmit.bool])
    const eliminar= async (id)=>{
        const url=`${API}/category/${id}`;
        methodDelete(url,axios,(err)=>{
            setError({new:true},err);
            setIsSubmit({bool:true});
        },()=>setIsSubmit({bool:true}));
    }
    return(
        <div className="categorias-block">
            <h1>Categorías</h1>
            <ul className="categorias-container">
                <li className="category-element first"><p>ID</p><p>CATEGORÍA</p><p>ACCIÓN</p></li>
                { categories.map( (el)=>(
                    <li className="category-element" key={el._id} ><p>{el._id}</p><p>{el.name}</p><button className="button-logout" onClick={()=>eliminar(el._id)} >
                        <DeleteIcon /><p >Eliminar</p>
                        </button></li>
                      )      ) }
            </ul>
            {((error.new)?<h2 id="message-delete"> {error.err}</h2>
            :<h2 className="note" id="message-delete"> {isSubmit.deleted} </h2>)}
        </div>
    )
}