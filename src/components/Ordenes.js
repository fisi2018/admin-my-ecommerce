import "./Ordenes.css";
import "./Categorias.css";
import {API} from "../config";
import { useState,useEffect } from "react";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from "axios";
export default function Ordenes(){
    const [ordenes,setOrdenes]=useState([]);
    const[list,setList]=useState({});
    const[isSubmit, setIsSubmit]=useState({
        bool:false,
        deleted:""
    });
    const[error,setError]=useState({
        new:false,
        err:""
    });
    const showMessage=()=>{
        const $message=document.getElementById("message-delete");
        $message.classList.toggle("note-active")
        
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
    const getOrdenes=async ()=>{
        const url=`${API}/order/orders`;
        let res= await axios.get(url),
        json= await res.data;
        setOrdenes(json);
    }
    useEffect(()=>{
        getOrdenes();
    },[isSubmit.bool]);
    const completeOrder= async (id)=>{
        try{
        const url=`${API}/order/${id}`;
        let res=await axios.delete(url),
        json=await res.data;
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
    return(
        <div className="categorias-block">
            <h1>Ordenes</h1>
            <ul className="categorias-container">
                <li className="category-element product-size">
                    <p>Nombre</p>
                    <p>Celular</p>
                    <p>Dirección</p>
                    <p>Monto total</p>
                    <p>Acciones</p>
                </li>
                {
                    ordenes.map((el)=>(
                            <>
                        <li className="category-element product-size">
                            <p>{el.name}</p>
                            <p>{el.phone}</p>
                            <p>{el.address}</p>
                            <p>{el.total}</p>
                            <div>

                            <button onClick={()=>(list[el._id])?setList({
                                ...list,
                                [el._id]:false
                            }):setList({
                                ...list,
                                [el._id]:true
                            })} className="button-logout" >
                                <VisibilityIcon/>
                                <p>Ver orden</p></button>
                            </div>
                            <div>

                            <button className="button-logout" onClick={()=>completeOrder(el._id)}>
                                <CheckCircleIcon/>
                                <p>Completar orden</p>
                            </button>
                            </div>
                        </li>
                        {list[el._id] && <div className="details-container">
                            {
                                el.list.map((obj)=>(
                                    <li className="category-element orden-style">
                                        <p>{obj.producto._id}</p>
                                        <p>{obj.producto.name}</p>
                                        <p>{obj.size}</p>
                                        <p>{obj.color}</p>
                                        <p>{obj.count}</p>
                                    </li>
                                ))
                            }
                            </div>}
                            </>
                    ))
                }
            </ul>
            {isSubmit.bool && ((error.new)?<h2 id="message-delete"> {error.err}</h2>
            :<h2 className="note" id="message-delete"> {isSubmit.deleted} </h2>)}
        </div>
    )
}