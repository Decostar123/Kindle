import React , {useEffect , useRef, useState,useContext}from 'react'

// import {storage , auth } from "../firebase" ; 
// import {ref, uploadBytes , listAll, getDownloadURL, deleteObject, 
//     updateMetadata } from "firebase/storage" ; 
import {v4} from "uuid" ; 
import { ContextInfo } from '../../App.js';
import bookImageSubstitue from "../../assets/bookImageSubstitue.jpg"
// import "../../style/BetterFile.css" ; 
import "../../css/AddNewFilePopup.css"
import { ToastContainer, toast } from 'react-toastify';
import library from "../../assets/library.png" ; 
import 'react-toastify/dist/ReactToastify.css';
 import {ChevronRight , ChevronLeft  } from "lucide-react" ; 
 import {readBook} from "../../utils/updateBookRecentlyViewed.js"
const AddNewFilePopup = ( { setUploadBook, setBlack, fileUpload, setFileUpload, setSpinner,
    hashID, setHashID   , uploadNewBook ,  setUploadNewBook}) => {
        const {fileList, setFileList, originalFile, setOriginalFile,
            dataBaseCreated,
            setDataBaseCreated,
            request,
            setRequest, firebaseFileFetched, setFirebaseFileFetched , 
            bookRecentlyViewed, setBookRecentlyViewed
          } = useContext(ContextInfo)
        const [metaDataTitle, setMetaDataTitle] = useState("")  ; 
        const [metaDataDescription , setMetaDataDescription] = useState("") ;

        const [ bookCategoryTag , setBookCategoryTag] = useState([]) ; 
        const [bookCategoryInd , setBookCategoryInd] = useState(0) ; 
        const [activebookCategoryInd , setactivebookCategoryInd] = useState(0) ; 
        const [startingIndex , setStartingIndex ] = useState(0) ; 



        function categoryFilter(category){

            if( !category || category === 'All' ){
                setFileList( originalFile ) ; 
                return;
            }
            const arr = originalFile.filter( ele => {
                let got = false; 
                // for (let catg of ele.categories) {
                    if (ele.bookGenre.toLowerCase().includes(category.toLowerCase())) {
                        got = true; 
                        // break; 
                    // }
                }
                return got; 
            });
            setFileList( () => arr ) ;
            
        }
        

        const getFileFromInput = ()=>{


            if( !firebaseFileFetched ){
                return new Promise((resolve, reject) => {
                const url = "https://firebasestorage.googleapis.com/v0/b/uploadingfile-b50cc.appspot.com/o/The-Jungle-Books-text.pdf?alt=media&token=c129e8b6-6e88-402a-b119-dbb092898277"
                fetch(url)
                .then(async (response) => {
                    const data = await response.arrayBuffer();
                    // Get the content type from the response headers
                    const contentType = response.headers.get('content-type');
                    // Get the size of the data
                    const size = data.byteLength;
                    resolve({
                        type: contentType,
                        size: size,
                        data: data,
                    });

                    console.log( "all the fileds got " , data ,   contentType , size)
                })
                .catch((error) => {
                    reject(error);
                });

            }) 
                





            }
            return new Promise((resolve, reject) => {
                // const file = document.getElementById('file').files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    // document.getElementById('file').value = '';
                    resolve({
                        type: fileUpload.type,
                        size: fileUpload.size,
                        data: event.target.result,
                    });

                    
                };
                reader.onerror = (event) => {
                    reject(event.target.error);
                };
                reader.readAsArrayBuffer(fileUpload);
            });





        }


        const storeFileInIndexedDB = (uploadedBookObj)=>{

            // setFileList(prev=>[...prev , uploadedBookObj])  ;
            // setOriginalFile( prev=>[...prev ,uploadedBookObj] ) ; 

            // setBlack( true ) ;
            // setSpinner( true ) ; 
            
            const indexedDB =
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB ||
            window.shimIndexedDB;

            if (!indexedDB) {
                setDataBaseCreated(false);
                console.log("IndexedDB could not be found in this browser.");
                return;
              }
          
              const req = indexedDB.open("BooksDatabase", 1);
          
              req.onerror = function(event) {
                setDataBaseCreated(false);
                  setSpinner(false) ; 
                    setBlack( false  )  ; 
                    alert("Some Error Ocuured !! Try Again Later ")
                console.log("Database error: " + event.target.errorCode);
              };
          
              req.onupgradeneeded = function (event) {
                const db = event.target.result;
                const store = db.createObjectStore("booksinformation", { keyPath: 'id', autoIncrement: true });
                store.createIndex("bookName", "bookName", { unique: false });
                console.log("Database upgrade needed");
            };

              req.onsuccess = async  function() {

                const file = await getFileFromInput();

                console.log( " the upoaded file " , file )

                const fileObject = { ...uploadedBookObj,  ...file}
                console.log( " the upoaded fileObject " , fileObject )
              
                const db = req.result;
                
                const storeName = "booksinformation" ; 

                const store = db.transaction("booksinformation", 'readwrite').objectStore("booksinformation");

                const putRequest = store.put(fileObject); 
                putRequest.onsuccess = function (event) {
                    // Get the key ID of the newly inserted record
                    const keyID = event.target.result;
                    console.log("Key ID of the uploaded record:", keyID);
                    const objectUploaded = {...fileObject} ; 
                    objectUploaded.id  = keyID ;
                   
                    const originalFileCategory = originalFile ; 

                    // const catg = objectUploaded.ca
                    // originalFileCategory.push(objectUploaded) ;
                    // console.log(" originalFileCategory.push(objectUploaded) ;" , originalFileCategory ) 
                    // updateFileTags(originalFileCategory) ; 
                     setFileList(prev=>[...prev , {...objectUploaded}])  ;
                setOriginalFile( prev=>[...prev ,{...objectUploaded}] ) ; 
                // window.location.reload() ; 
                if( firebaseFileFetched){
                    setBlack( false ) ; 
                    setSpinner( false  ) ;  
                     setFileUpload( null ) ;
                     setUploadNewBook( false ) ; 
                }else{
                    // localStorage.setItem("bookID1" ,  keyID ) ; 
                    // localStorage.setItem("bookID2" ,-1 ) ; 
                    // localStorage.setItem("bookID3" , -1  ) ; 
                    // localStorage.setItem("bookID4" ,  -1  ) ; 

                    // const arr = [ keyID,keyID,-1, -1 ]
                    // setBookRecentlyViewed(arr);
                    setBookRecentlyViewed(readBook(keyID));
                    setFirebaseFileFetched( true  ) ; 
                    localStorage.setItem("firebaseFileFetched" , true ) ;  
                }

                

              
                };

	      

                };

             


        }

        useEffect(()=>{
            if( firebaseFileFetched ) return ; 
            async function fetchTheFile(){
            const uploadedBookObj = {  currentPage : 1 , totalPage : 0 , notes : []    } ; 
            const fileUploadName = "The-Jungle-Books-text" ; 
                const bookInforMation = await fetch("https://www.googleapis.com/books/v1/volumes?q="+fileUploadName) ; 
                console.log("bookInforMation",bookInforMation);
                const bookInforMationJson = await bookInforMation.json() ; 
                console.log("bookInforMationJson",bookInforMationJson);
                let cnt = 0 ;
                for( let entry of bookInforMationJson.items){
                    if( entry.volumeInfo?.authors ){
                        uploadedBookObj.bookAuthor  = entry.volumeInfo.authors[0] ;
                        cnt++;
                    }
                    if( entry.volumeInfo?.categories ){
                        uploadedBookObj.bookGenre  = entry.volumeInfo.categories[0] ;
                        cnt++;
                    }
                    if( entry.volumeInfo?.imageLinks?.thumbnail ){
                        uploadedBookObj.bookImageLink  =  entry.volumeInfo.imageLinks.thumbnail ;
                        cnt++;
                    }
                   
                    if( cnt === 3 ) break ; 

                }

                if( !uploadedBookObj.bookAuthor){
                    uploadedBookObj.Author = "Anonyomus"  ; 
                   }
                   
                   if( !uploadedBookObj.bookGenre){
                    uploadedBookObj.bookGenre = "Anoyomus"  ; 
                   }
                   
                   if( !uploadedBookObj.bookImageLink){
                    uploadedBookObj.bookImageLink = bookImageSubstitue  ; 
                   }
      
                //    if( cnt !== 3 ){
                //     bookEntries[ind] = bookObj ;
                //    }


                uploadedBookObj.bookName = fileUploadName ; 
                console.log( "uploadedBookObj.bookAuthor", uploadedBookObj.bookAuthor, uploadedBookObj.bookGenre, uploadedBookObj.bookImageLink );
                


            storeFileInIndexedDB( uploadedBookObj ) ; 

                }
            fetchTheFile() 


        } , [firebaseFileFetched])

        useEffect(()=>{
            if( !uploadNewBook ) return ; 
                setUpload()  ; 
        } , [uploadNewBook])


        const uploadRef = useRef( null ) ; 
        function setUpload(){
            // alert("got clicked ")
           
            uploadRef.current.click() ; 
            // const upload = document.querySelector("#upload") ; 
            // const fileInput = document.querySelector("#fileInput") ; 
            // upload.addEventListener( 'click' , ()=>{
            //     fileInput.click() ;
            // })
            // fileInput.addEventListener( 'change' , ()=>{
            //     console.log(fileInput.files[0])  ; 
            // })
        }
        const uploadFile = async (  )=>{
            // setFileUpload(uf  );

            try{
                console.log("111111111111111 in the Header ");
                console.log( fileUpload) ;
                
                if( fileUpload === null ) return ; 
                if( fileUpload.type !== "application/pdf" || !fileUpload.type ){
                    // alert("Only PDF files allowed !!") ; 

                    console.log("only pdf files ae allowed ") ; 
                    toast.error("Only PDF files allowed !!") ; 
                    // <ToastContainer /> ; 
                    // toast.error("Only PDF files allowed !!", {
                    //     position: toast.POSITION.TOP_RIGHT,
                    //   });
                    
                    setFileUpload( null ) ; 
                    setUploadNewBook( false ) ; 

                    
                    // setSpinner( false ) ; 
                    // setBlack( false ) ;
                    return ; 
    
                }
                if( originalFile.length === 15  ){
                    // alert("Only PDF files allowed !!") ; 

                    console.log("only pdf files ae allowed ") ; 
                    toast.error("Only 15 books allowed !!") ; 
                    // <ToastContainer /> ; 
                    // toast.error("Only PDF files allowed !!", {
                    //     position: toast.POSITION.TOP_RIGHT,
                    //   });
                    
                    setFileUpload( null ) ; 
                    setUploadNewBook( false ) ; 

                    
                    // setSpinner( false ) ; 
                    // setBlack( false ) ;
                    return ; 
    
                }
                setUploadBook( false ) ;
                console.log("2222222222222222 fileuplaod is not null ");
                // alert(fileUpload.name)
                // const fileRef = ref( storage , `${hashID}/${fileUpload.name}-${v4()}`) ;
                // const fileReff = ref( storage , `${hashID}/web_prac6.pdf-24c9204b-3e61-437d-b56f-fc025f9eb53b`) ;
                // const snapshot = await uploadBytes( fileRef , fileUpload ) ; 
                // const url =  await getDownloadURL( snapshot.ref) ; 
                // const aaa = [] ;
                // const newMetadata = {
                   
                //       "title": "Name1" ,
                //       "description" : "Description1" , 
                //       "currentPage": 1 , 
                //       "totalPage" : -1 ,
                //       "genre" : "genre1"
                    
                //   } ;
                 
                //   console.log(  " new MetaData " , newMetadata )  ; 
                // const metaData = await updateMetadata(fileRef, newMetadata) ; 
                // const des =  metaData.customMetadata.description ; 
                // const ttl = metaData.customMetadata.title ; 
                // const cP = metaData.customMetadata.currentPage ; 
                // const tP = metaData.customMetadata.totalPage
                // const bookName = fileUpload.name ; 
                // console.log( " METADATA" , metaData ) ;
                  setSpinner(true) ; 
                setBlack( true  )  ; 
                console.log("the file uploaded objedt ----- " , fileUpload ) ; 

                const uploadedBookObj = {  currentPage : 1 , totalPage : 0 , notes : []    } ; 
                const bookInforMation = await fetch("https://www.googleapis.com/books/v1/volumes?q="+fileUpload.name) ; 
                console.log("bookInforMation",bookInforMation);
                const bookInforMationJson = await bookInforMation.json() ; 
                console.log("bookInforMationJson",bookInforMationJson);
                let cnt = 0 ;
                for( let entry of bookInforMationJson.items){
                    if( entry.volumeInfo?.authors ){
                        uploadedBookObj.bookAuthor  = entry.volumeInfo.authors[0] ;
                        cnt++;
                    }
                    if( entry.volumeInfo?.categories ){
                        uploadedBookObj.bookGenre  = entry.volumeInfo.categories[0] ;
                        cnt++;
                    }
                    if( entry.volumeInfo?.imageLinks?.thumbnail ){
                        uploadedBookObj.bookImageLink  =  entry.volumeInfo.imageLinks.thumbnail ;
                        cnt++;
                    }
                   
                    if( cnt === 3 ) break ; 

                }

                if( !uploadedBookObj.bookAuthor){
                    uploadedBookObj.Author = "Anonyomus"  ; 
                   }
                   
                   if( !uploadedBookObj.bookGenre){
                    uploadedBookObj.bookGenre = "Anoyomus"  ; 
                   }
                   
                   if( !uploadedBookObj.bookImageLink){
                    uploadedBookObj.bookImageLink = bookImageSubstitue  ; 
                   }
      
                //    if( cnt !== 3 ){
                //     bookEntries[ind] = bookObj ;
                //    }


                uploadedBookObj.bookName = fileUpload.name ; 
                console.log( "uploadedBookObj.bookAuthor", uploadedBookObj.bookAuthor, uploadedBookObj.bookGenre, uploadedBookObj.bookImageLink );
                
                

                // const reader = new FileReader();
                // const fileInfo = fileUpload;
                // if (fileInfo) {
                //     reader.readAsBinaryString(fileUpload);
                //     reader.onloadend = () => {
                //         const count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
                //         console.log('Number of Pages:', count);

                //         uploadedBookObj.totalPage = count ; 
                        
                //     }
                // }
                storeFileInIndexedDB( uploadedBookObj ) ; 
                
                
               

        
               
                    // alert( "file uploaded successsfully ") ;

                    // setSpinner(false) ; 
                    // setBlack( false  )  ; 
                   
                   
    
                    // fileRef.put(file, newMetadata);
        
            }               
            catch( err ){
                console.error( err ) ; 
                    alert( "  error ocurred try again later ") ;
                    setSpinner(false) ; 
                    setBlack( false  )  ;  
                   
            }
          
           
        } 
        useEffect(()=>{
            console.log( "fileUpload is can be found here e", fileUpload );

            // console.log( fileUpload ) ; 
           
            uploadFile() ; 
        }, 
        [fileUpload]);

        function updateFileTags( originalFileCategory){

            console.log("function updateFileTags(){  " , originalFileCategory );
            if( !originalFileCategory ) return  ; 
            let categoryA = "" , categoryB = "" , categoryC = "" ; 
            // const bookArr = [] ; 
            const bookObj =  originalFileCategory.reduce( ( acc , ele )=>{
                const categoryArr = ele.bookGenre ; 
                if( !categoryArr ) return acc ; 
                const category = categoryArr ; 

                console.log( "const category = categoryArr ; " ,  category , acc[category])
                if( !acc[category]){
                    acc[category] = 1 ; 
                }else {
                    acc[category] = acc[category]  +  1; 
                }
               
                return acc ; 
            } , {} ); 
            console.log( " the bookOnject " , bookObj )

            const bookArr = Object.keys(bookObj) ;  
            
            console.log(  " the bookArr s rhis "  , bookArr ) ; 

            bookArr.sort((a, b) => bookObj[b] - bookObj[a]); // Corrected sorting function
            bookArr.unshift("All" ) ; 
            console.log(  "  bookArr.unshift(all) "  , bookArr ) ; 
            setBookCategoryTag( (prev)=> bookArr);



        }

        useEffect( ()=>{

            updateFileTags(originalFile) ; 
           
        } , [originalFile ])

  return (       
                <div id="addBook">



                 {/* <div id="threeCircle"></div> */}
                 <div id="uploading">
                    <div id="uploadingLeft">

                        {/* <svg  viewBox="0 0 50 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.33342 5.25H10.4167C12.6126 5.25 14.4126 6.678 14.573 8.4875L14.5834 8.75V33.25C14.5827 34.1326 14.1853 34.9824 13.4707 35.6294C12.7561 36.2764 11.777 36.6729 10.7292 36.7395L10.4167 36.75H8.33342C7.28236 36.7499 6.27015 36.4162 5.49946 35.8159C4.72876 35.2156 4.25648 34.3929 4.17716 33.5125L4.16675 33.25V8.75C4.16675 6.9055 5.86675 5.3935 8.02091 5.25875L8.33342 5.25ZM20.8334 5.25H22.9167C25.1126 5.25 26.9126 6.678 27.073 8.4875L27.0834 8.75V33.25C27.0827 34.1326 26.6853 34.9824 25.9707 35.6294C25.2561 36.2764 24.277 36.6729 23.2292 36.7395L22.9167 36.75H20.8334C19.7824 36.7499 18.7701 36.4162 17.9995 35.8159C17.2288 35.2156 16.7565 34.3929 16.6772 33.5125L16.6667 33.25V8.75C16.6667 6.9055 18.3667 5.3935 20.5209 5.25875L20.8334 5.25ZM35.3626 8.75C37.1126 8.75 38.7126 9.67925 39.3001 11.1055L39.398 11.3802L45.6793 31.9358C45.9401 32.7907 45.8069 33.6968 45.3062 34.4727C44.8056 35.2486 43.9744 35.837 42.9792 36.12L42.6793 36.1953L40.6605 36.6292C39.6472 36.8467 38.5736 36.7363 37.6525 36.3202C36.7315 35.904 36.0301 35.2123 35.6876 34.3822L35.5897 34.111L29.3063 13.5573C29.0451 12.7016 29.1786 11.7947 29.6801 11.0183C30.1817 10.242 31.0141 9.65359 32.0105 9.37125L32.3084 9.296L34.3251 8.862C34.6639 8.78802 35.0125 8.75039 35.3626 8.75ZM10.4167 7.875H8.33342C8.08972 7.87527 7.85382 7.94716 7.66661 8.07821C7.4794 8.20926 7.35268 8.3912 7.30841 8.5925L7.29175 8.75V33.25C7.29175 33.677 7.6605 34.0375 8.14592 34.111L8.33342 34.125H10.4167C10.9272 34.125 11.3542 33.8135 11.4417 33.4075L11.4584 33.25V8.75C11.4581 8.5453 11.3725 8.34714 11.2165 8.18988C11.0605 8.03263 10.8439 7.92618 10.6042 7.889L10.4167 7.875ZM22.9167 7.875H20.8334C20.5897 7.87527 20.3538 7.94716 20.1666 8.07821C19.9794 8.20926 19.8527 8.3912 19.8084 8.5925L19.7917 8.75V33.25C19.7917 33.677 20.1605 34.0375 20.6459 34.111L20.8334 34.125H22.9167C23.4272 34.125 23.8542 33.8135 23.9417 33.4075L23.9584 33.25V8.75C23.9581 8.5453 23.8725 8.34714 23.7165 8.18988C23.5605 8.03263 23.3439 7.92618 23.1042 7.889L22.9167 7.875ZM35.3647 11.375L35.2334 11.382L35.1022 11.4048L33.0855 11.837C32.8519 11.8863 32.646 12.0023 32.5031 12.1651C32.3601 12.3279 32.2891 12.5275 32.3022 12.7295L32.3334 12.9045L38.6167 33.4582C38.6744 33.6457 38.8044 33.8119 38.9865 33.9306C39.1686 34.0494 39.3925 34.1141 39.623 34.1145L39.7543 34.1092L39.8834 34.0882L41.9043 33.6507C42.14 33.5997 42.347 33.4809 42.4894 33.315C42.6317 33.1491 42.7004 32.9465 42.6834 32.7425L42.6522 32.5885L36.3709 12.0312C36.313 11.8439 36.1828 11.6779 36.0008 11.5592C35.8188 11.4405 35.5951 11.3757 35.3647 11.375Z" fill="black"/>
                        </svg> */}
                        <img src={library} />
                        <label>Library</label>

                    </div>
                    <div className="categoryOptions fourth-step">
                       {startingIndex !== 0 && 
                        <ChevronLeft  className='leftArrow'  onClick={()=> setStartingIndex(prev => prev-1)}/>
                       } 

                       
                          {bookCategoryTag.map((ele, ind) => {
                            return (
                                (ind < startingIndex  || ind >= startingIndex+4 )? (
                                    <div key={ind}></div>
                                ) : (
                                    <div
                                        key={ind}
                                        style={{ background: ind === activebookCategoryInd ? "rgba(145, 83, 206, 0.56)" : "" }}
                                        className="categoryDiv"
                                        onClick={() => {
                                            categoryFilter(bookCategoryTag[ind]);
                                            setactivebookCategoryInd(ind);
                                        }}
                                    >
                                        <p>{bookCategoryTag[ind]}</p>
                                    </div>
                                )
                            );
                        })}
                    
                     
                        {
                            (startingIndex + 3  < bookCategoryTag.length -1  ) &&

                             <ChevronRight  className='rightArrow' onClick={()=>setStartingIndex(prev => prev+1)}/>
                        }
                        
                    </div>
                    <button id="done" 
                    onClick={()=>{
                       
                       
                            setUpload();
                        }}
                    
                     >
                    {"+ Add Books"}
                    <input onChange={(e)=>{   
                        //   setSpinner(true) ; 
                     e.preventDefault() ;  
                     
                     console.log( " the fileu[loaded " , e.target.files[0])
                     setFileUpload(e.target.files[0]) ;
        }} style={{display : "none"}} ref={uploadRef} type="file" />
                    </button>
                 </div>
                    
                    
                    
                </div>
       
    
   
  )
}

export default AddNewFilePopup ; 