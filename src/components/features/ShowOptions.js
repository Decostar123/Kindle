import React , { useState, useEffect }from 'react';
// import 'boxicons';
import {Link} from "react-router-dom"
import "./style/ClockMessage.css";

import { Columns2  , RectangleVertical , ArrowBigUp , GalleryHorizontal} from 'lucide-react' ; 
// import { ArrowBigUp } from 'lucide-react';


const ShowOptions = ({showOptions,moveRight,showStopWatch, setSinglePageMode ,singlePageMode,  pageMovement , 
    scrollMode , setScrollMode , iframeRef , iframeURL , setIframePageNumber}) => {
    
const [ jumpToPage , setJumpToPage] = useState(false ) ; 

const [jumpToPageNumber , setJumpToPageNumber] = useState( 1 ) ; 

function jumpToPageChange(){
    setJumpToPage(true);
    const pageVal = Number(sessionStorage.getItem("currentPage") ) ; 
    setJumpToPageNumber( pageVal)  ; 
}

function goToPage(){
    // alert( jumpToPageNumber ) ; 
    
    const totalPage = Number(sessionStorage.getItem("totalPage") ) ; 
    let pageVal  = jumpToPageNumber ; 
    pageVal = Math.max( 1 , pageVal ) ; 
    pageVal = Math.min( pageVal , totalPage  )  ; 
    sessionStorage.setItem("currentPage" , pageVal) ; 
    if( !scrollMode){
      
        pageMovement( pageVal ) ; 
        
    }
  else{

   
    
    // alert( `in the scroll Mode ${pageVal}`)
    // console.log(" the iframeURL is thsi " , iframeURL + `#page=${pageVal}`)  ;
    setIframePageNumber( pageVal) ;  
    // iframeRef.current.src= iframeURL + `#page=${pageVal}` ;
  }
  
        setJumpToPage( false ) ; 
}
return(
    <div id="showOptions" ref={showOptions} >

        <Link to="/">
        <div className="svgIcon link ttooltip"   >
            <svg  viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.91974 9.8706L0.959868 11.0934L0 9.8706L0.959868 8.6478L1.91974 9.8706ZM25 23.7071C25 24.1658 24.857 24.6057 24.6024 24.9301C24.3477 25.2544 24.0024 25.4366 23.6423 25.4366C23.2823 25.4366 22.9369 25.2544 22.6823 24.9301C22.4277 24.6057 22.2847 24.1658 22.2847 23.7071H25ZM7.74818 19.7412L0.959868 11.0934L2.8796 8.6478L9.66792 17.2956L7.74818 19.7412ZM0.959868 8.6478L7.74818 0L9.66792 2.4456L2.8796 11.0934L0.959868 8.6478ZM1.91974 8.14104H15.4964V11.6002H1.91974V8.14104ZM25 20.248V23.7071H22.2847V20.248H25ZM15.4964 8.14104C18.0169 8.14104 20.4342 9.41658 22.2164 11.6871C23.9987 13.9576 25 17.037 25 20.248H22.2847C22.2847 17.9544 21.5695 15.7548 20.2964 14.133C19.0234 12.5113 17.2967 11.6002 15.4964 11.6002V8.14104Z" fill="black"/>
            </svg>
          
  <span className="ttooltiptext">Back</span>


        </div>


        </Link>
   

    <div className="svgIcon darkShadow ttooltip" onClick={()=>moveRight()}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.5 5H11L16 12L11 19H15.5L20.5 12L15.5 5Z" fill="black"/>
<path d="M8.5 5H4L9 12L4 19H8.5L13.5 12L8.5 5Z" fill="black"/>
</svg>
<span className="ttooltiptext" >Show Options</span>


    </div>


    <div className="svgIcon ttooltip" onClick={()=>moveRight()} style={{ backgroundColor:showStopWatch? "white":"rgba(145, 83, 206, 0.25)" }}>
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M12.915 13L13.2266 12.7585C16.5191 10.2056 19.2565 7.12492 21.3 3.673C21.4849 3.36068 21.5809 3.01199 21.5795 2.6581C21.5781 2.30422 21.4793 1.95615 21.2919 1.64503C21.1046 1.3339 20.8344 1.0694 20.5057 0.875177C20.177 0.680951 19.8 0.563047 19.4083 0.532004L17.4516 0.379004C13.1587 0.0412272 8.84123 0.0412272 4.5483 0.379004L2.59164 0.532004C2.19994 0.563047 1.82289 0.680951 1.49419 0.875177C1.16549 1.0694 0.895385 1.3339 0.708009 1.64503C0.520633 1.95615 0.421828 2.30422 0.420425 2.6581C0.419022 3.01199 0.515066 3.36068 0.69997 3.673C2.74344 7.1249 5.48089 10.2056 8.7733 12.7585L9.08497 13L8.7733 13.2415C5.48056 15.7953 2.74309 18.877 0.69997 22.33C0.515434 22.6423 0.419687 22.9908 0.421277 23.3445C0.422868 23.6982 0.521745 24.046 0.709083 24.3569C0.896422 24.6678 1.16639 24.9322 1.49488 25.1263C1.82338 25.3204 2.20018 25.4384 2.59164 25.4695L4.5483 25.6225C8.84164 25.9615 13.1583 25.9615 17.4516 25.6225L19.4083 25.4695C19.7998 25.4384 20.1766 25.3204 20.5051 25.1263C20.8336 24.9322 21.1035 24.6678 21.2909 24.3569C21.4782 24.046 21.5771 23.6982 21.5787 23.3445C21.5803 22.9908 21.4845 22.6423 21.3 22.33C19.2567 18.8776 16.5192 15.7964 13.2266 13.243L12.915 13ZM11.0066 11.509L11.01 11.506L11.595 11.053C14.6062 8.71793 17.1181 5.90727 19.0066 2.7595L17.2333 2.62C13.0857 2.29367 8.91428 2.29367 4.76664 2.62L2.99164 2.7595C4.88057 5.90791 7.39296 8.7191 10.405 11.0545L10.9883 11.5075C10.9899 11.5082 10.9916 11.5087 10.9933 11.509H11C11.0022 11.5094 11.0044 11.5094 11.0066 11.509ZM11.01 14.494L11.0066 14.491H11C10.9978 14.4906 10.9955 14.4906 10.9933 14.491L10.9883 14.494L10.405 14.947C7.39299 17.2824 4.8806 20.0936 2.99164 23.242L4.76497 23.38C8.91497 23.707 13.0866 23.707 17.2333 23.38L19.0066 23.2405C17.1182 20.0922 14.6064 17.281 11.595 14.9455L11.01 14.494Z" fill="black"/>

</svg>

<span className="ttooltiptext" >Timer</span>


    </div>

    <div className="svgIcon ttooltip" onClick={()=>moveRight()} style={{ backgroundColor:showStopWatch? "rgba(145, 83, 206, 0.25)" :"white" }}>
    <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.375 3.125V0.375H16.625V3.125H8.375ZM11.125 18.25H13.875V10H11.125V18.25ZM12.5 29.25C10.8042 29.25 9.2055 28.9237 7.704 28.271C6.2025 27.6183 4.89075 26.7301 3.76875 25.6063C2.64583 24.4833 1.75804 23.1711 1.10538 21.6696C0.452708 20.1681 0.125917 18.5699 0.125 16.875C0.125 15.1792 0.451792 13.5805 1.10538 12.079C1.75896 10.5775 2.64675 9.26575 3.76875 8.14375C4.89167 7.02083 6.20387 6.13304 7.70537 5.48037C9.20687 4.82771 10.8051 4.50092 12.5 4.5C13.9208 4.5 15.2844 4.72917 16.5906 5.1875C17.8969 5.64583 19.1229 6.31042 20.2687 7.18125L22.1937 5.25625L24.1188 7.18125L22.1937 9.10625C23.0646 10.2521 23.7292 11.4781 24.1875 12.7844C24.6458 14.0906 24.875 15.4542 24.875 16.875C24.875 18.5708 24.5482 20.1695 23.8946 21.671C23.241 23.1725 22.3533 24.4843 21.2313 25.6063C20.1083 26.7292 18.7961 27.6174 17.2946 28.271C15.7931 28.9246 14.1949 29.2509 12.5 29.25ZM12.5 26.5C15.1583 26.5 17.4271 25.5604 19.3063 23.6813C21.1854 21.8021 22.125 19.5333 22.125 16.875C22.125 14.2167 21.1854 11.9479 19.3063 10.0688C17.4271 8.18958 15.1583 7.25 12.5 7.25C9.84167 7.25 7.57292 8.18958 5.69375 10.0688C3.81458 11.9479 2.875 14.2167 2.875 16.875C2.875 19.5333 3.81458 21.8021 5.69375 23.6813C7.57292 25.5604 9.84167 26.5 12.5 26.5Z" fill="black"/>
</svg>
<span className="ttooltiptext" >StopWatch</span>



    </div>

    <div onClick={()=>moveRight()}  className="svgIcon darkShadow ttooltip">
    <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0V20H9.563L12.281 22.72L13.001 23.406L13.721 22.719L16.437 20H26V0H0ZM2 2H24V18H15.594L15.281 18.28L13 20.563L10.72 18.283L10.406 18.001H2V2ZM6 5V7H20V5H6ZM6 9V11H20V9H6ZM6 13V15H16V13H6Z" fill="black"/>
</svg>
<span className="ttooltiptext" >Messages</span>
    </div>
    <div className="svgIcon darkShadow ttooltip"  style={{ backgroundColor: singlePageMode ?"rgba(145, 83, 206, 0.25)" : "white"}} onClick={()=>
        {
            setScrollMode( false )
            setSinglePageMode(true) ; }  } >
        <RectangleVertical/>
        <span className="ttooltiptext" >Single Page</span>
    </div>
    <div className="svgIcon darkShadow ttooltip"  style={{ backgroundColor: !singlePageMode ?"rgba(145, 83, 206, 0.25)" : "white"}}
     onClick={()=>
        {
            setScrollMode( false ) ; 
            setSinglePageMode(false) ;  }  } >
   <Columns2/>
   <span className="ttooltiptext" >Two Pages</span>
    </div>
    
    <div className="svgIcon darkShadow ttooltip jump" style={{cursor : jumpToPage ? "auto" : "pointer" }} >
        
    { jumpToPage&& <>
        <input className="jumpToPage" type="number" value={jumpToPageNumber} onChange={(e)=> setJumpToPageNumber(e.target.value)}  />
        
        <ArrowBigUp  
        style={{width:"20px" , height : "20px" , margin:"0" , marginTop:"5px"  , cursor :"pointer"}} 
        onClick={()=>goToPage()} />
    </> } 


       { !jumpToPage && 
       <>
       <ArrowBigUp style={{width:"30px" , height : "30px" , margin:"0" }} onClick={()=>
        

        jumpToPageChange()  
        
        }/>
        <span className="ttooltiptext" >Jump To Page</span> 
       </>
      
       
       
       } 
    </div>

<div className="svgIcon darkShadow ttooltip  showOptions-firstStep" >
<span className="ttooltiptext" >Scroll Mode</span>
<GalleryHorizontal onClick={()=>setScrollMode(true)} />
</div>


</div>


)


}

export default ShowOptions