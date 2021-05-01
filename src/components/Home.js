import "./Home.css";
import {useEffect,useState} from "react";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {API} from "../config";
import Cookies from "universal-cookie";
import {Link} from "react-router-dom";
import imgUser from "../img/user.png";
import axios from "axios";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {showMessage, methodCreate, methodGet} from "./Tools";
const cookies=new Cookies();
export const Home=()=>{
    const[index, setIndex]=useState(0);
   
    const[isSubmit, setIsSubmit]=useState({
        bool:false,
        productMessage:false,
        colorMessage:false,
        contentMessage:false,
        added:{}
    });
    const[error,setError]=useState({
        new:false,
        err:""
    });
    const [category,setCategory]=useState("");
    const [size,setSize]=useState({});
    const [colors,setColors]=useState({});
    const[formColor,setFormColor]=useState({});
    const [formProduct, setFormProduct]=useState({
        name:"",
        description:"",
        priceMayor:0,
        priceMenor:0,
        sizes:"",
        img:"",
        formData:``
    }
    );
    const [formNews, setFormNews]=useState({
        formDataNews:``
    });
    const [categories, setCategories]=useState([]);
    const {formData}=formProduct;
    const {formDataNews}=formNews;
    const getCategories= ()=>{
        const url=`${API}/category/categories`;
        methodGet(url,axios,(err)=>{
            setIsSubmit({...isSubmit,message:"message",bool:true});
            setError({new:true,err});
        },(json)=>setCategories(json));
    };
    useEffect(()=>{
        getCategories();
        setFormProduct({
            ...formProduct,
            formData:new FormData()
        });
        setFormNews({
            ...formNews,
            formDataNews:new FormData()
        })
    },[]);
    const handleCategory=(e)=>{
        setCategory(e.target.value);
    }
    const addCategory= ()=>{
        const url=`${API}/category/create`;
        const form={name:category};
        methodCreate(url,form,axios,(err)=>{
            setIsSubmit({
            ...isSubmit,
            bool:true,
            message:"message"
        });
        setError({
            new:true,
            err
        })
        },()=>{setIsSubmit({
            ...isSubmit,
            bool:true,
            message:"message"
        })});
    }
  
    useEffect(()=>{
        getCategories();
        if(isSubmit.bool || isSubmit.productMessage || isSubmit.contentMessage){
            showMessage(isSubmit.message);
            setIsSubmit({
                bool:false,
                productMesage:false,
                contentMessage:false,
                colorMessage:false,
                added:{}
            });
            setError({
                ...error,
                new:false
            })
         
        }
    },[isSubmit.bool || isSubmit.productMessage || isSubmit.contentMessage]);

    const handleProductColor=(e)=>{
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
    const addColor=()=>{
        let list=colors;
        let obj={
            nameColor:formColor.nameColor,
            codeColor:formColor.codeColor
        }
        list={
            ...list,
            [index]:obj
        }
        setColors(list);
        formData.set("colors",JSON.stringify(list));
        formData.set(index,formColor.imgColor);
        setIndex(index+1);
        setIsSubmit({
            ...isSubmit,
            colorMessage:true
            });  
    }
    useEffect(()=>{
        if(index!==0){
            showMessage("messageColor");
        }
    },[index]);
    const handleProduct=(e)=>{
        if(e.target.name==="img"){
            formData.set(e.target.name,e.target.files[0]);
            setFormProduct({
                ...formProduct,
                [e.target.name]:e.target.files[0]
            })
        }
        else{

            formData.set(e.target.name,e.target.value);
            setFormProduct({
            ...formProduct,
                [e.target.name]:e.target.value
            })
        }
    }
    const handleChecked=(e)=>{
        setSize({
            ...size,
            [e.target.name]:e.target.checked
        });
    }
    const addProduct=()=>{
        let tallas=[];
       for(const talla in size){
           if(size[talla]){
                tallas.push(talla)
           }
       };
       tallas=tallas.toString();
       formData.set("sizes",tallas); 
       formData.set("index",index);
       const url=`${API}/producto/createProduct`;
       methodCreate(url,formData,axios,(err)=>{
        setIsSubmit({productMessage:true,message:"messageProduct"});
         setError({new:true,err});
       },()=>{
           setIsSubmit({productMessage:true,message:"messageProduct"});
           setIndex(0);
           setFormProduct({...formProduct,formData:new FormData()});
       });
      
    }
    const handleContent=(e)=>{
        if(e.target.name==="img"){
            formDataNews.set(e.target.name,e.target.files[0]);
            setFormNews({
                ...formNews,
                [e.target.name]:e.target.files[0]
            })
        }
        else{
            formDataNews.set(e.target.name,e.target.value);
            setFormNews({
                ...formNews,
                [e.target.name]:e.target.value
            })
        }
    }
    const sendContent= async()=>{
        const url=`${API}/table/createTable`;
        methodCreate(url,formDataNews,axios,(err)=>{
            setIsSubmit({contentMessage:true, message:"messageContent"});
            setError({new:true, err})
        },()=>setIsSubmit({contentMessage:true, message:"messageContent"}));
    }
    return(
        <>
        <div className="container-form">
            
            <div className="form-block">
                <h2>Agregar categoría</h2>
                <input onChange={handleCategory} placeholder="Nombre" className="input-element" type="text"/>
                <button onClick={addCategory} className="button-element">Agregar</button>
            </div>
            { ((error.new)?<h2 className="error" id="message">{error.err}</h2>:
            <h2 className="note" id="message">Se ha agregado {category} exitosamente</h2>) }
        </div>
        <div className="container-form">

            <div className="form-block large">
                <h2>Agregar producto</h2>
                <input onChange={handleProduct} name="name" placeholder="Nombre" className="input-element" type="text"/>
                <input onChange={handleProduct} name="description" placeholder="Descripcion corta" className="input-element" type="text"/>
                <input onChange={handleProduct} name="priceMayor" placeholder="Precio al por mayor" className="input-element" type="number"/>
                <input onChange={handleProduct} name="priceMenor" placeholder="Precio al por menor" className="input-element" type="number"/>
                <div className="addColor-block"> 
                <input onChange={handleProductColor} name="codeColor" type="color"/>
                <input onChange={handleProductColor} className="input-element small" placeholder="Color" name="nameColor" type="text"/>
                <input onChange={handleProductColor} name="imgColor" className="input-img" type="file" accept="img/*" />
                <button className="buttonAddColor" onClick={addColor} >
                    <AddCircleIcon className="circle" />
                </button>
                </div>
                <select onChange={handleProduct} className="select-element"  name="category" >
                    <option value="---">Seleccione una categoría</option>
                    {
                    categories.map((el)=>(
                         <option key={el._id} value={el._id}>{el.name}</option>
                    ))
                }</select>
                <input onChange={handleProduct} name="img" className="input-img" type="file" accept="image/*"/>
                <h3>Tallas</h3>
                <div className="checkbox-list">
                <input onChange={handleChecked} name="s" className="check-element" id="s" type="checkbox"/>
                <label htmlFor="s">S</label>
                <input onChange={handleChecked} name="m" className="check-element" id="m" type="checkbox"/>
                <label htmlFor="m">M</label>
                <input onChange={handleChecked} name="l" className="check-element" id="l" type="checkbox"/>
                <label htmlFor="l">L</label>
                <input onChange={handleChecked} name="xl" className="check-element" id="xl" type="checkbox"/>
                <label htmlFor="xl">XL</label>
                <input onChange={handleChecked} name="xxl" className="check-element" id="xxl" type="checkbox"/>
                <label htmlFor="xxl">XXL</label>
                <input onChange={handleChecked} name="xxxl" className="check-element" id="xxxl" type="checkbox"/>
                <label htmlFor="xxxl">XXXL</label>
                <input onChange={handleChecked} name="Estandar" className="check-element" id="stan" type="checkbox"/>
                <label htmlFor="stan">Estándar</label>

                </div>
                <button onClick={addProduct} className="button-element">Agregar</button>
            </div>
             <h2 id="messageColor" className="note" >Se ha agregado el color exitosamente </h2> 
            { ((error.new)?<h2 className="note error" id="messageProduct">Ha ocurrido un error:{error.err}</h2>:
            <h2 className="note" id="messageProduct">Se ha agregado {formProduct.name} exitosamente</h2>) }
        </div>
        <div className="container-form">
            <div className="form-block">
                <h2>Agregar contenido</h2>
                <input onChange={handleContent} name="title" placeholder="Título" className="input-element" type="text"/>
                <input onChange={handleContent} name="category" placeholder="Tema" className="input-element" type="text"/>
                <textarea onChange={handleContent} placeholder="Contenido" className="text-area" name="description" cols="35" rows="7"></textarea>
                <input onChange={handleContent} name="img" className="input-img" type="file" accept="image/*"/>
                <button onClick={sendContent} className="button-element">Agregar</button>
            </div>
            { ((error.new)?<h2 className="note error" id="messageContent">{error.err}</h2>:
            <h2 className="note" id="messageContent">Se ha agregado {formNews.title} exitosamente</h2>) }
        </div>
        </>
    )
}
export const header=(burger,burger2,asidePanel)=>{
        const logout=()=>{
        cookies.remove("id");
        cookies.remove("username");
        cookies.remove("name");
        cookies.remove("role");
        window.location.reload();
    }
        return(
            <header>
                <div className="burger-container">
                    <button onClick={()=>{

                        burger.current.classList.toggle("is-active");
                        burger2.current.classList.toggle("is-active");
                        asidePanel.current.classList.toggle("show")
                    }
                    } ref={burger} className="hamburger hamburger--spring" type="button">
                        <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
            <h1>Bienvenido {cookies.get("name")}</h1>
            <div className="logout-container">
                <button onClick={logout} className="button-logout">
                <ExitToAppIcon/>
                <p>Logout</p>
                </button>
            </div>
            </header>
        );
    }
    export const aside=(burger,burger2,asidePanel)=>{
        return(
            <aside ref={asidePanel} className="menu-burger">
                <div className="profile-container">
                    <button onClick={()=>{
                        burger.current.classList.toggle("is-active");
                        burger2.current.classList.toggle("is-active");
                        asidePanel.current.classList.toggle("show")
                    }
                    } ref={burger2} className="hamburger hamburger--spring" type="button">
                        <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                        </span>
                    </button>
                    <img className="photo-profile" src={(cookies.get("img"))?(`${API}/user/img/${cookies.get("id")}`):imgUser} alt={cookies.get("name")}/>
                    <h3>{cookies.get("name")}</h3>
                </div>
                <ul className="list-container">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/ordenes" > Ver órdenes </Link></li>
                    <li><Link to="/productos">Ver productos</Link></li>
                    <li><Link to="/categorias" >Ver categorías</Link></li>
                    <li><Link to="/publicaciones" >Ver publicaciones</Link></li>
                    {cookies.get("role")==="1" && <li><Link to="/usuarios">Ver usuarios</Link></li>}
                    
                </ul>
            </aside>
        )
    }