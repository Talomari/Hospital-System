import React from 'react';
import $ from 'jquery';
import { TextField, Grid,
		Button,CardActions,withStyles,CircularProgress } from 'material-ui';
import Modal from 'react-modal';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import green from 'material-ui/colors/green';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : '10%',
    bottom                : '10%',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const customStyles1 = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : '10%',
    bottom                : '10%',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
	const styles = theme => ({
  	  input: {
	    display: 'none',
	  },
	   buttonSuccess: {
	    backgroundColor: green[500],
	    '&:hover': {
	      backgroundColor: green[700],
	    },
	    buttonProgress: {
	    color: green[500],
	    position: 'absolute',
	    top: '50%',
	    left: '50%',
	    marginTop: -12,
	    marginLeft: -12,
	  },
	  },
	  
	});
class PatientDataAddRecord extends React.Component{
	constructor(props){
		super(props);
		this.state={
			userData:[],
			username:'',
			description:'',
			image: '',
            modalIsOpen: false,
            modalIsOpenImageMedical: false, 
    		modalIsOpenImageResult:false,
            loading: false,
    		success: false,
    		imageMedical:'',
    		imageResult:''
         };

	 
	    this.openModal = this.openModal.bind(this);
	    this.closeModal = this.closeModal.bind(this);
	    this.openModalImageMedical = this.openModalImageMedical.bind(this);
	    this.closeModalImageMedical = this.closeModalImageMedical.bind(this);
	    this.openModalImageResult = this.openModalImageResult.bind(this);
	    this.closeModalImageResult = this.closeModalImageResult.bind(this);
		this.retriveData=this.retriveData.bind(this);
		this.handleChange=this.handleChange.bind(this);
		this.addMedicalRecords=this.addMedicalRecords.bind(this);
	
	}


	retriveData() {
    	var that=this;
    	$.ajax({
    	type:'GET',
		dataType: "json",
 		url: '/api/userController/'+that.state.username,
 		success:function(data){
 			that.setState({
 				userData:data
 			});

 		}
		});
    }
	handleChange(e){
		this.setState({
			[e.target.name]:e.target.value
		})
	}
	addMedicalRecords(){
		 var obj1={
			username:this.state.username, 
			description:this.state.description,
			image: this.state.image
		}
		var that=this;
		console.log(obj1)
		$.ajax({
			url:'/api/medical/addRecorde',
			type:"POST",
			data:obj1,
			success:(data)=>{
				console.log(data)
				alert("success");
			},
			error:(err)=>{
				console.log(err)
			}
		});
	}
 closeModal() {
    this.setState({modalIsOpen: false});
  }
 openModal() {
    this.setState({modalIsOpen: true});
  }
  closeModalImageMedical() {
	this.setState({modalIsOpenImageMedical: false});
   }
  openModalImageMedical(e) {
    this.setState({
    	modalIsOpenImageMedical: true,
    	imageMedical:e.target.value
    });
    }
    closeModalImageResult(){
    	this.setState({modalIsOpenImageResult: false});
    }
    openModalImageResult(e) {
    this.setState({
    	modalIsOpenImageResult: true,
    	imageResult:e.target.value
    });
    }

    onChangeImageRecord(e){
      var imgReader = new FileReader();
      var img = e.target.files[0];
      var that = this;
      var imgCode = ''
      // var target = e.target.name;
      imgReader.onload = function(upload) {
        imgCode = upload.target.result
        imgCode = imgCode.slice(22)
        $.ajax({
          url: `https://api.imgur.com/3/image`,
          method: 'POST',
          headers: {"Authorization": "Client-ID bb8a64e82b834b5"},
          data:imgCode
        })
        .done (function (data) {
          that.setState({
            image: data.data.link,
            loading: false,
            success: true,
          });
        })
        .fail(function( jqXHR, textStatus ) {
          alert("item not found, textStatus");
        });
      };
      imgReader.readAsDataURL(img)
    }
   handleButtonClick() {
    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true
        }
      );
    }
}
 
render(){
	var that =this;
	const { classes } = this.props;
		const { loading, success } = this.state;
		const imageRecord = classNames({
	      [classes.buttonSuccess]: success,
	    });	
	if(this.state.userData.length>0){

	return(
		<div>
		<div className="card">
		<div className='container-fluid'>
		<Grid item xs={6} sm={3}>
	        <TextField
	          required
	          id="userName"
	          label="Username"
	          placeholder="Enter Username"
	          margin="normal"
	          value={this.state.userName}
	          name="username"
      		  onChange={this.handleChange}
	        />
		</Grid>
		<CardActions>
		    <Button variant="raised" color="primary" onClick={this.retriveData} >
	        	Retrive Data
	      	</Button>
		</CardActions>
		<CardActions>
		    <Button variant="raised" color="primary" onClick={this.openModal} >
	        	Add Record
	      	</Button>
		</CardActions>
        <Modal
          isOpen={this.state.modalIsOpen}
          contentLabel="Add New Record"
          style={customStyles}
        >
 		<div className="card">
		<div className='container-fluid'>
		<h2 style={{textAlign:'center'}}>Add New Record</h2>
	    <Grid container spacing={24}>
		<Grid item xs={18} sm={9}>
			<TextField
	          required
	          id="description"
	          label="Description"
	          placeholder="Description"
	          name="description"
	          width="200"
	          margin="normal"
	          fullWidth
      		  onChange={this.handleChange}
	        />
		</Grid>
		<Grid item xs={6} sm={3}>
			 <input
              	required
		        accept="image/*"
		        className={classes.input}
		        id="raised-button-file"
		        type="file"
		        onChange={this.onChangeImageRecord.bind(this)}
		      />
            <label htmlFor="raised-button-file">
		        <Button variant="raised" component="span" className={imageRecord} disabled={loading} onClick={this.handleButtonClick.bind(this)} >
		          Upload Record Image
		        </Button>
		      	{loading && <CircularProgress size={24} className={classes.buttonProgress} />}
		    </label>
		</Grid>
		<CardActions>
		    <Button variant="raised" color="primary" onClick={this.addMedicalRecords} >
	        	Add Medical Records
	      	</Button>
		</CardActions>
		<CardActions>
		    <Button variant="raised" color="primary" onClick={this.closeModal} >
	        	Close
	      	</Button>
		</CardActions>	
		</Grid>
		</div>
		</div>
        </Modal>	
	    <h1 style={{textAlign:'center'}}>User Data</h1>      	
		 <table className="table table-bordered">
		    <thead style={{textAlign:'center'}}>
		      <tr>
		        <th>Id</th>
		        <th>User Name</th>
		        <th>Full Name</th>
		        <th>Id Card Number</th>
		        <th>Phone</th>
		        <th>Email</th>
		        <th>User Type</th>
		        <th>Gender</th>
		      </tr>
		    </thead>		    
		    <tbody>
		    {this.state.userData.map(function(item){
		    	return(
        	     <tr>
			        <td>{item._id}</td>
			        <td>{item.username}</td>
			        <td>{item.FullName}</td>
			        <td>{item.idCardNumber}</td>
			        <td>{item.phone}</td>
			        <td>{item.email}</td>
			        <td>{item.userType}</td>
			        <td>{item.gender}</td>
		         </tr>
		         )
            })}
		    </tbody>
         </table>
         </div>
         </div>
         <br/>
         <div className="card">
         <div className='container-fluid'>
          <h1 style={{textAlign:'center'}}>User Lab Result</h1>      	
		 <table className="table table-bordered">
		    <thead style={{textAlign:'center'}}>
		      <tr>
		        <th width='20%'>Id </th>
		        <th>Lab Technician Name</th>
		        <th>Medical Examination Time</th>
		        <th>Result Entry Time</th>
		        <th>Description</th>
		        <th>Image Result</th>
		      </tr>
		    </thead>		    
		    <tbody style={{textAlign:'center'}}>
		    {this.state.userData[0].labResults.map(function(item){
		    	return(
        	     <tr>
			        <td>{item._id}</td>
			        <td>{item.labTechnicianId.fullName}</td>
			        <td>{item.medicalExaminationTime}</td>
			        <td>{item.resultEntryTime}</td>
			        <td>{item.description}</td>
			        <td><button style={{'background-color': 'white'}} value ={item.imageOfResult} onClick={that.openModalImageResult}>{item.imageOfResult}</button></td>
		         </tr>
		         )
            })}
		    </tbody>
         </table>
	    </div>
	    </div>
	    <Modal
          isOpen={this.state.modalIsOpenImageResult}
          contentLabel="Add New Record"
          style={customStyles1}
        >
 		<div className="card">
		<div className='container-fluid'>
	
	    <Grid container spacing={24}>
	    <Grid item xs={24} sm={12}>
	        <img  style={{textAlign:'center'}} src ={this.state.imageResult}></img>
		<CardActions>
		    <Button variant="raised" color="primary" onClick={this.closeModalImageResult} >
	        	Close
	      	</Button>
		</CardActions>	
		</Grid>
		</Grid>
		</div>
		</div>
        </Modal>
	    <br/>
	    <div className="card">
	    <div className='container-fluid'>
          <h1 style={{textAlign:'center'}}>User Medical Records</h1>      	
		 <table className="table table-bordered">
		    <thead style={{textAlign:'center'}}>
		      <tr>
		        <th width='20%'>Id </th>
		        <th>Doctor Name</th>
		        <th>Description</th>
		        <th>Image Medical</th>
		      </tr>
		    </thead>		    
		    <tbody style={{textAlign:'center'}}>
		    {this.state.userData[0].medicalRecords.map(function(item, index){
		    	return(
        	     <tr key={index}>
			        <td>{item._id}</td>
			        <td>{item.doctorId.fullName}</td>
			        <td>{item.description}</td>
			        <td value ={item.image}><button style={{'background-color': 'white'}} value ={item.image} onClick={that.openModalImageMedical}>{item.image}</button></td>
		         </tr>
		         )
            })}
		    </tbody>
         </table>
	    </div>
	    </div>
	     <Modal
          isOpen={this.state.modalIsOpenImageMedical}
          contentLabel="Add New Record"
          style={customStyles1}
        >
 		<div className="card">
		<div className='container-fluid'>
	
	    <Grid container spacing={24}>
	    <Grid item xs={24} sm={12}>
	        <img  style={{textAlign:'center'}} src ={this.state.imageMedical}></img>
		<CardActions>
		    <Button variant="raised" color="primary" onClick={this.closeModalImageMedical} >
	        	Close
	      	</Button>
		</CardActions>	
		</Grid>
		</Grid>
		</div>
		</div>
        </Modal>
	    <br />
	    </div>
		)
	}else{
			return(
		<div>
		<div className="card">
		<div className='container-fluid'>
		<Grid item xs={6} sm={3}>
			<TextField
	          required
	          id="username"
	          label="UserName"
	          placeholder="UserName"
	          width="200"
	          margin="normal"
	          name="username"
      		  onChange={this.handleChange}
	        />
		</Grid>
		<CardActions>
		    <Button variant="raised" color="primary" onClick={this.retriveData} >
	        	Retrive Data
	      	</Button>
		</CardActions>	
		</div>
		</div>
	    </div>
	    )
	
}

}
}

PatientDataAddRecord.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientDataAddRecord);
