import React, { useState, useEffect , useRef } from 'react';
// import { Document, Page } from 'pdfjs-dist/react-pdf.js';
import "../style/WrapPage.css"
import { useContext } from 'react';
// import ClockMessage from './features/ClockMessage.js';
import { ContextInfo } from '../App.js';
// import WrapHeader from './features/WrapHeader.js';
import "../style/WrapPage.css"
import ClockMessage from './features/ClockMessage.js';
import {readBook} from "../utils/updateBookRecentlyViewed.js"
import { Link, useLocation } from 'react-router-dom';
// import './iframeResizer.min.js';

import {setFrequentBooks} from "../utils/updateBookRecentlyViewed.js"
const PDFViewer = () => {

  const location = useLocation(); 

  const clockMessageRef= useRef(null);
  const pdfContainer  = useState(null)
  const btnRef=useRef(null) ; 
  const pdfRef = useRef(null);


  const {fileList, setFileList, originalFile, setOriginalFile,setCalendarEntry, setMetadataPath, 
    bookRecentlyViewed, setBookRecentlyViewed  } = useContext(ContextInfo) ;
  // const pdfRef = useRef(null);
  console.log( "the filelist is ", fileList  )
  // const pdfArrayBuffer = fileList[Number(sessionStorage.getItem("bookIndex"))].data ; 
  // const pageNumber = 2 ;

  //  console.log('Scroll yyyyyyyyyyyy position:', pdfRef?.current?.contentWindow?.scrollY);
  // console.log('Scroll Y position:', scrollY)


  const onloadToIframe =  ()=>{
  
    const iframeWindow = pdfRef.current.contentWindow;
        
    // Get the scroll position
    const scrollX = iframeWindow.scrollX || iframeWindow.pageXOffset;
    const scrollY = iframeWindow.scrollY || iframeWindow.pageYOffset;
  
  
    console.log('Scroll X position:', scrollX);
    console.log('Scroll Y position:', scrollY);
  //   pdfRef.current.contentWindow.body.addEventListener('scroll',function() {
  //     console.log("getting scrooled " )
    
  // }  )  ;
  console.log("2222222222222222" , pdfRef.current.document ) 
  console.log( "4444444444444" , pdfRef.current.contentWindow)
  
  console.log( pdfRef.current.contentWindow.onload)
  pdfRef.current.contentWindow.onscroll = ()=>{
    alert(" getting scrooled ")
  }
  pdfRef.current.onload = function() {
    const pageNumber = 2; // Set the desired page number
    const pdfViewer = pdfRef.current.contentWindow.PDFViewerApplication.pdfViewer;
    // pdfViewer.currentPageNumber = pageNumber;

    console.log(  pdfViewer.currentPageNumber) ; 
};
  // if ( pdfRef.current.contentDocument ) {
  //   const currentPageNum= pdfRef.current.contentDocument.getElementById('pageNumber').value;
  //   alert(currentPageNum);
  // }
  



  }


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const param1 = Number(searchParams.get('bookID')) ;
    sessionStorage.setItem("bookKey" , param1) ; 
console.log(" the id of the ebook  i s" , param1) ; 









    if ( pdfRef.current) {

      // pageSelector
      // window.iFrameResize({ log: true }, pdfRef.current);

      let calendarArr = JSON.parse(localStorage.getItem("calendarArray") ); 
      if( calendarArr){
        const date = new Date();
        let day = date.getDate();
        calendarArr[day-1] = true ; 
        localStorage.setItem("calendarArray" , JSON.stringify(calendarArr)) ; 
        setCalendarEntry([...calendarArr])
      }
      
      const { PDFViewerApplication } = pdfRef.current;


      const openDBRequest = indexedDB.open("BooksDatabase", 1);

        openDBRequest.onsuccess = function(event) {
            const db = event.target.result;

            const transaction = db.transaction("booksinformation", "readonly");
            const objectStore = transaction.objectStore("booksinformation");

            const key = Number(sessionStorage.getItem("bookKey"))  ;
            const getRequest = objectStore.get(key);

            getRequest.onsuccess = function(event) {
                const record = event.target.result;
                // if (record) {
                //     setRecord(record);
                // } else {
                //     console.log("Record not found");
                // }
                console.log( "the detalis of the recird are ...." , record.currentPage, record.data) ; 
           
                const bookID = record.id ; 

                console.log( " the id of the nook is " , bookID )

                setBookRecentlyViewed(readBook(bookID) )
           
              
                const blob = new Blob(  [record.data] , { type: 'application/pdf' });
                const objectUrl = URL.createObjectURL(blob);
                pdfRef.current.src = objectUrl;
                const pageNumber = record.currentPage === -1 ? 1 : record.currentPage ; 
                const urlWithPageNumber = `${objectUrl}#page=${2}`;
                
                pdfRef.current.src = urlWithPageNumber;
                console.log("pageeSelecoter " , pdfRef.current )  ; 
                console.log("the ifme is this " , pdfRef.current.contentWindow  ) ;
                pdfRef.current.contentWindow.onscroll = ()=>{
                  console.log("hhhhhhhhhhhhiiiiiiiiii")
                }
              
                // const iframeDocument =   pdfRef.current.contentWindow.document ;
                // console.log( iframeDocument);
                // pdfRef.current.width = pdfRef.current.contentWindow.document.body.scrollWidth ; 
                // iframeDocument.body.style.backgroundColor = "red"
                // console.lof
                // alert(pdfRef.current.contentDocument.getElementById('pageNumber').value);
           
              };

            getRequest.onerror = function(event) {
                console.error("Error retrieving record:", event.target.error);
            };
        };

        openDBRequest.onerror = function(event) {
            console.error("Error opening database:", event.target.error);
        };
        // pdfRef.current.contentWindow.onscroll=function(){ alert("hi")  }
      
       

    }
  }, [] );

  return (
    <div>
{/* <WrapHeader clockMessageRef={clockMessageRef} pdfRef={pdfRef} btnRef={btnRef}/> */}
<ClockMessage  clockMessageRef={clockMessageRef} pdfContainer={pdfContainer} fileList={[]}/>
<div className='pdfContainer' ref={pdfContainer}>
<iframe 
className="custom-iframe" 
      title="PDF Viewer"
      ref={pdfRef}
      allowtransparency="true" 
     
     
      frameborder="0"
    
    ></iframe>

</div>


</div>


    
  );
}


export default PDFViewer;
