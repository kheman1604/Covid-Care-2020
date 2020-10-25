var express=require('express');
var app=express();
var path=require('path');
var bodyparser=require('body-parser');
var mongoose=require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var User=require('./models/user');
var nodemailer = require('nodemailer');
var Applicant=require('./models/applicant.js');
var Donor=require('./models/donor.js');
var Return=require('./models/return.js');


//mongoose.connect("mongodb://localhost/covid_care_1", { useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connect("mongodb+srv://divesh:dev123456789@cluster0.l6u2q.mongodb.net/covid_care?retryWrites=true&w=majority",{ useNewUrlParser: true , useUnifiedTopology: true });

app.use(express.static(path.join(__dirname, '/public')));
//passport config
app.use(require("express-session")({
	secret:"divesh abhishek kheman",
	resave:false,
	saveUninitialized: false
}));

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'covidcare96@gmail.com',
	  pass: 'covidop123'
	}
  });

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()) );
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({extended:true,limit: '50mb'}));
var port=process.env.PORT || 3000;
app.listen(port,process.env.IP,function(){
	console.log("server started.");
});

app.get("/",function(req,res){
	res.render("index.ejs",{currentUser:req.user});
});
app.get("/contact",function(req,res){
    res.render("contact.ejs",{currentUser:req.user});
});
app.get("/notification",function(req,res){
    res.render("notification.ejs",{currentUser:req.user});
});
app.get("/hbed",function(req,res){
    res.render('hospitalbed.ejs',{currentUser:req.user});
});
app.get("/mbed",function(req,res){
    res.render('medicalbeds.ejs',{currentUser:req.user});
});
app.get("/signup",function(req,res){
	res.render('signup.ejs',{currentUser:req.user});
});
app.post("/signup",function(req,res){
	var newUser= new User({username:req.body.username,email:req.body.email});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
			{
				console.log(err);
				res.redirect('/signup');
			}
		else{
			var mailOptions = {
				from: 'covidcare96@gmail.com',
				to:req.body.email ,
				subject: 'Sign Up Confirmation',
				text: 'Welcome '+req.body.username+' to Covid Care family!'
			  };
			  
 transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	  console.log(error);
	} else {
	  console.log('Email sent: ' + info.response);
	}
  });
  
			res.redirect('/login');
		}
	});
});
app.get("/login",function(req,res,next){
	res.render("login.ejs",{currentUser:req.user});
});
app.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),function(req,res){
	res.redirect('/dash');
});
app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/',)
});

app.get('/hosdash',function(req,res){
	res.render('hosdash.ejs',{currentUser:req.user});
});
app.get('/dash',function(req,res){
	res.render('dash.ejs',{currentUser:req.user});
});
app.get('/analysis',function(req,res){
	res.render('analysis.ejs',{currentUser:req.user});
});
app.get('/plasmadash',function(req,res){
	res.render('plasmahome.ejs',{currentUser:req.user});
});
app.get('/plasmareq',function(req,res){
	res.render('plasmareq.ejs',{currentUser:req.user});
});
app.post("/plasmadash",function(req,res){
	var name=req.body.name;
	var email=req.body.email;
	var contact=req.body.contact;
	var location=req.body.location;
	var bloodgroup=req.body.bloodgroup;
	var newappl={name:name,location:location,bloodgroup:bloodgroup,contact:contact,email:email};
	Applicant.create(newappl,function(err,newlycreated){
		if(err)
			console.log(err);
		else{
			console.log(newlycreated);
			res.redirect("/plasmadash");
			
		}
			
	});
	
});
app.get("/donate",function(req,res){
Applicant.find({},function(err,allappl){
	if(err)
		console.log(err);
	else
		res.render("donate.ejs",{appl:allappl,currentUser:req.user});
});
});
app.get("/donate/:id",function(req,res){
	Applicant.findById(req.params.id,function(err,appl){
		if(err)
			console.log(err);
		else
			res.render("donor.ejs",{appl:appl,currentUser:req.user});
	})
})
app.post("/donate/:id/applied",function(req,res){
	Applicant.findById(req.params.id,function(err,appl){
		if(err){
			console.log(err);
			res.redirect("/jobs/list");
		}
		else{
			Donor.create(req.body.donor,function(err,newlycreated){
				if(err)
					console.log(err);
				else
					{
						
					
						  var mailOptions = {
							from: 'covidcare96@gmail.com',
							to:appl.email ,
							subject: 'New Donor Received',
							html: "<p>"+newlycreated.name+" from "+newlycreated.location+" has signed up for donation </p>.<p>You can reach him at "+newlycreated.phone+"</p><br><strong>Thanks Team Covid Care.</strong>",
										
						};

						  transporter.sendMail(mailOptions, function(error, info){
							if (error) {
							  console.log(error);
							} else {
							  console.log('Email sent: ' + info.response);
							}
						  });
						 
						
						res.render('applied.ejs',{currentUser:req.user})
					}
			});
		}
	});
});
app.get('/analytics',function(req,res){
	res.render('chart.ejs',{currentUser:req.user});
	
});
app.get('/comp',function(req,res){
	res.render('comp.ejs',{currentUser:req.user});
	
});
app.post("/analytics",function(req,res){
	var mail=req.body.mail;
	var graph=req.body.graph;
	var newr={mail:mail,graph:graph};
	Return.create(newr,function(err,newlycreated){
		if(err)
			console.log(err);
		else{
			
			console.log(newlycreated);
			res.redirect("/analytics");
			var mailOptions = {
				from: 'covidcare96@gmail.com',
				to:newlycreated.mail ,
				subject: 'Graph report',
				text:"Your Report",
				attachments: [
					{   // encoded string as an attachment
					  filename: 'graph.jpg',
					  content: newlycreated.graph.split("base64,")[1],
					  encoding: 'base64'
					}
				  ]						
			};

			  transporter.sendMail(mailOptions, function(error, info){
				if (error) {
				  console.log(error);
				} else {
				  console.log('Email sent: ' + info.response);
				}
			  });
			 

			
		}
			
	});
	
});


