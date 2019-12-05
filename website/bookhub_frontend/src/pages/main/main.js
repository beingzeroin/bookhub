import React, { Component } from 'react';
import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBCarouselItem,
  MDBView,
  MDBInput
} from 'mdbreact';
import UserAuth from '../../user_auth';
import Navbar from '../navbar/navbar.js';
import CollapseButton from './../../component/CollapseButton.js';
import Upload from './../../component/UploadBox.js';
import CarouselItem from '../../component/Carousel.js';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';



let books = [];
const testImg = ["https://www.qualtrics.com/m/assets/blog/wp-content/uploads/2018/08/shutterstock_1068141515.jpg",
  "https://www.qualtrics.com/m/assets/blog/wp-content/uploads/2018/08/shutterstock_1068141515.jpg",
  "https://www.qualtrics.com/m/assets/blog/wp-content/uploads/2018/08/shutterstock_1068141515.jpg"];
let citems =[];
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      depts: [],
      courses: [],
      dropdownlist: [],
      query_dept: undefined,
      query_course: undefined,
      searchInput: undefined,
      sendMessage: "",
      messageReceiver: ''
    };
  }


  componentDidMount() {
    this.getBooks();
    this.getDepartments();
    this.getDropdownList();
  }

  getBooks = () => {
    fetch('http://localhost:4000/books')
      .then(res => res.json())
      .then(res => {
        this.setState({ books: res.data });
        books = res.data;
      })
      .catch(err => console.error(err));
  };

  getDepartments = () => {
    fetch('http://localhost:4000/department')
      .then(res => res.json())
      .then(res => this.setState({ depts: res.data }))
      .catch(err => console.error(err));
  };

  getDropdownList = () => {
    fetch('http://localhost:4000/dropdownlist')
      .then(res => res.json())
      .then(res => this.setState({ dropdownlist: res.data }))
      .catch(err => console.error(err));
  };

  getRequestedBooksDeptCourse = async (dept, course) => {
    fetch(
      `http://localhost:4000/requestedBooksByDeptByCourse?dept=${dept}&course=${course}`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ books: res.data });
        books = res.data;
      })
      .catch(err => console.error(err));
  };

  getRequestedBooksDept = async query_dept => {
    fetch(`http://localhost:4000/requestedBooksByDept?dept=${query_dept}`)
      .then(res => res.json())
      .then(res => {
        this.setState({ books: res.data });
        books = res.data;
      })
      .catch(err => console.error(err));
  };

  getSearchResults = async SQLParam => {
    let q = `http://localhost:4000/searchResults?searchInput=${SQLParam}`;
    console.log(q);
    fetch(
      `http://localhost:4000/searchResults?searchInput=${SQLParam}`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({ books: res.data });
        books = res.data;
      })
      .catch(err => console.error(err));


  };

  uploadFiles = async (fileName, fileData) => {
    fetch(`http://localhost:4000/upload?fileData=${fileData}&fileName=${fileName}`, { mode: 'no-cors' })
      .catch(err => console.error(err));
  };

  //----------------------------------- Handeling the serach ---------------------------------
  handleSearch = e => {
    this.setState({ searchInput: e.target.value });
  };

  enterPressed = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      event.preventDefault();

      let searchWords = this.state.searchInput.trim().split(' ');
      this.getSearchResults(this.generateSQLSearchParam(searchWords));
    }

  };

  //----------------- Generate where condition for the query ---------------------------------
  generateSQLSearchParam(searchWords) {
    let SQLSearchParam = '';
    for (let i = 0; i < searchWords.length; i++) {
      if (i === 0) {
        SQLSearchParam = SQLSearchParam.concat(searchWords[i]);
      } else {
        SQLSearchParam = SQLSearchParam.concat("%20"+searchWords[i]);
      }
    }

    return SQLSearchParam;
  }

  //-----------------------Side bar: Query Books by Course and Dept -------------------------------
  getBooksByCourse = async e => {
    let course = e.currentTarget.id;
    let dept = e.currentTarget.className;
    this.setState({ query_course: course });
    this.setState({ query_dept: dept });
    this.getRequestedBooksDeptCourse(dept, course);
  };

  //-----------------------Side bar: Query Books by Dept -------------------------------------
  getBooksByDept = e => {
    const dept = e.currentTarget.id;
    this.setState({ query_dept: dept });
    this.getRequestedBooksDept(dept);
  };

  //----------------------- Rendering the sidebar dropdown -------------------------------------
  renderDropdown = () => {
    let dropdown = this.state.dropdownlist;
    let dept = 'blah';
    let button_list = [
      <div onClick={() => this.getBooks()}>
              <Button>All listed books</Button>
            </div>
    ];
    let li_array = [];
    if (dropdown.length > 0) {
      for (let i = 0; i < dropdown.length; i++) {
        if (dropdown[i].dept_name !== dept) {
          //if not equal to dept name add classes of prev dep & set dept to current dept name
          //getting the previous ul and adding the list items to it before creating another unordered list
          dept = dropdown[i].dept_name;
          li_array = [];
          li_array.push(
            <div id={dept} onClick={e => this.getBooksByDept(e)}>
              <li>
                <a>ALL </a>
              </li>
            </div>
          );
          li_array.push(
            <div
              id={dropdown[i].course_name}
              className={dept}
              onClick={e => this.getBooksByCourse(e)}
            >
              <li>
                <a>{dropdown[i].course_name} </a>
              </li>
            </div>
          );
          button_list.push(
            <div id={dept}>
              <CollapseButton
                button_name={dept}
                collapse_content={
                  <ul className="list-unstyled components">{li_array}</ul>
                }
              />
            </div>
          );
        } else {
          //if the dept name does not change. keep on adding classes under that name
          li_array.push(
            <div
              id={dropdown[i].course_name}
              className={dept}
              onClick={e => this.getBooksByCourse(e)}
            >
              <li>
                <a>{dropdown[i].course_name} </a>
              </li>
            </div>
          );
        }
      }
    }

    return <div id="button_list">{button_list}</div>;
  };
  //----------------------- Creating carousel for cards -------------------------------------
  createCItemList(imgs) {
    let carouselItems = [];
    for (let i = 0; i < imgs.length; i++) {
        // let cItem = 
        carouselItems.push(
            <MDBCarouselItem itemId={i + 1}>
                <MDBView>
                    <img
                        className="d-block w-100"
                        src={imgs[i]}
                        id={"img"+i}
                    />
                </MDBView>
            </MDBCarouselItem>
        );
    }
    return carouselItems;
}


  //----------------------- Creating cards book data -------------------------------------
  renderBooks = ({
    list_id,
    title,
    edition,
    isbn,
    price,
    book_type,
    book_condition
  }) => (
    
      <div className="card-inline" key={list_id}>
        <MDBCol>
          <MDBCard style={{ width: '17rem' }}>
            {/* <MDBCardImage
              className="img-fluid"
              src="https://www.qualtrics.com/m/assets/blog/wp-content/uploads/2018/08/shutterstock_1068141515.jpg"
              waves
            /> */}
            <CarouselItem>
            </CarouselItem>
            <MDBCardBody>
              <MDBCardTitle>{title}</MDBCardTitle>
              <MDBCardText>
                Edition: {edition}, ISBN: {isbn}
              </MDBCardText>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  {' '}
                  Book Condition: {book_condition}
                </li>
                <li className="list-group-item"> Type: {book_type}</li>
                <li className="list-group-item"> Price: ${price}</li>
              </ul>
              {/* variant="popover" */}
              <PopupState  variant="popover" popupId="demo-popup-popover">
              {popupState => (
                <div>
                  <Button  color="primary" {...bindTrigger(popupState)}>
                    Contact
                  </Button>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      height: "100%",
                      width: "50vw",
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      height: "100%",
                      width: "50vw",
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                     
                    <Box p={5}>
                     <p align="top"> Message</p>
                     {/* onChange={e =>this.setState({sendMessage: e.target.value})} */}
                    <input id="message_box" type="textbox" rows="5" label="Type you message" onChange={e =>this.setState({sendMessage: e.target.value})}  />
                    <Button  color="primary" onClick={this.message.bind(this,{list_id})}>Send</Button>
                    </Box>
                  </Popover>
                </div>
              )}
            </PopupState>

              {/* <button className="btn btn-primary" onClick={this.message.bind(this,{list_id})}>Contact</button> */}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </div>
    );

    async message(list_id){
      console.log(list_id.list_id);
      console.log(this.state.sendMessage);
      document.getElementById("message_box").value="";
      await fetch(`http://localhost:4000/bookOwner?list_id=${list_id.list_id}`)
      .then(res => res.json())
      .then(res => res.data.map((p)=> this.setState({messageReceiver: p.email})))
      .catch(err => console.error(err));


      console.log("message ",this.state.sendMessage);
      await fetch(`http://localhost:4000/sendMessage?message=${this.state.sendMessage}`)
      .then(res => res.json())
      .catch(err => console.error(err));
 
      console.log("sender", UserAuth.getEmail());
      await fetch(`http://localhost:4000/sender?sender_email=${UserAuth.getEmail()}`)
      .then(res => res.json())
      .catch(err => console.error(err));

      console.log("receiver",this.state.messageReceiver);
      await fetch(`http://localhost:4000/receiver?receiver_email=${this.state.messageReceiver}`)
      .then(res => res.json())
      .catch(err => console.error(err));
    }

  //----------------------- Handling the file upload-------------------------------------
  handleImageChange = async (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let files = e.target.files;
    let base64 = "";
    reader.readAsDataURL(files[0]);

    // let blob = this.b64toBlob(files);
    // FileSaver.saveAs(blob, "image.png");
    // let object = new ActiveXObject("Scripting.FileSystemObject");

    reader.onloadend = () => {
      // this.setState({
      //   file: file,
      //   imagePreviewUrl: reader.result
      // })'

      base64 = reader.result;

      console.log(base64);

      // const imageBuffer = this.decodeBase64Image(base64);
      // console.log("image buffer ", imageBuffer);

      let base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      console.log(base64Data);

      const buf = new Buffer(base64Data,'base64');
      console.log("buf", buf);
      // const buf = new Buffer(base64,'base64');
      // const info = buf.toString('base64');
      this.uploadFiles("name", buf); //sending the data to the backend

      // let base64Image = base64.split(';base64,').pop();
      // fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function (err) {
      //   console.log('File created');
      // });
    }
  }

  //https://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
  decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];

    response.data = Buffer.from(matches[2]).toString('base64');
    console.log("matches[2]", matches[2]);

    return response;
  }

  //https://stackoverflow.com/questions/27980612/converting-base64-to-blob-in-javascript
  b64toBlob(dataURI) {

    // let byteString = atob(dataURI.split(',')[1]);
    // let ab = new ArrayBuffer(byteString.length);
    // let ia = new Uint8Array(ab);
    let imgType = 'image/jpeg';
    const sliceSize = 512;

    // for (let i = 0; i < byteString.length; i++) {
    //     ia[i] = byteString.charCodeAt(i);
    // }


    const byteCharacters = atob(dataURI);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    if (dataURI.contains("jpeg")) {
      imgType = 'image/jpeg';
    } else if (dataURI.contains("png")) {
      imgType = 'image/png';
    }

    return new Blob(byteArrays, { type: imgType });
  }

  uploadHandler = () => { }
  //----------------------- Handling the file download after upload -------------------------------------


  render() {
    return (
      <div className="wrapper">
        <nav id="sidebar" align="center">
          <div className="sidebar-header">
            <img
              className="center"
              width="100"
              height="100"
              src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/San_Jose_State_Spartans_logo.svg/378px-San_Jose_State_Spartans_logo.svg.png"
              alt="SJSU SAMMY"
            />
            <h3>Bookhub</h3>
          </div>
          <ul className="list-unstyled CTAs">
            <li>
              {/* <button type="button" className="btn btn-light">
                Add Book
              </button> */}
              {/* <input className="fileInput" type="file" onChange={(e) => this.handleImageChange(e)} /> */}
              <Upload />
            </li>
          </ul>
          <ul className="list-unstyled components">
            <p>Categories</p>
            {this.renderDropdown()}
          </ul>
        </nav>

        {/* <!-- Page Content  --> */}
        {citems = this.createCItemList(testImg)}
        <div id="content">
          <Navbar handleSearch={this.handleSearch} enterPressed={this.enterPressed} />
          {/* <h1> Welcome to SJSU Bookhub, {this.props.location.state.username} </h1> */}
          <div className="card-inline">
            {this.state.books.map(this.renderBooks)}
            {/* {<CarouselItem imgs={array}></CarouselItem>} */}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;