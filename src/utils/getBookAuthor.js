function getBookAuthor(bookID , originalFile){
    if( !bookID || bookID === -1 ) return "" ; 

    let arr = originalFile.filter( ele => ele.id === bookID ) ; 
    if( arr.length === 0 ) return ""
    return arr[0].bookAuthor ;
  }

  export default getBookAuthor; 