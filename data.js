// Fake mock data only. Dates are generated relative to today.
const day=n=>new Date(Date.now()+n*864e5-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
const TODAY=day(0);
const PT=[["Ayesha Khan",34,"F","Diabetes",5],["Bilal Ahmed",52,"M","Hypertension",1],["Sana Malik",27,"F","Asthma",5],["Usman Tariq",45,"M","Fracture",3],["Hina Raza",61,"F","Arthritis",3],["Omar Farooq",38,"M","Migraine",4],["Zara Sheikh",29,"F","Prenatal care",6],["Kamran Ali",70,"M","Heart disease",1],["Nida Hussain",41,"F","Thyroid",5],["Faisal Iqbal",56,"M","Kidney stones",5]]
 .map((p,i)=>({id:i+1,name:p[0],age:p[1],gender:p[2],condition:p[3],did:p[4],phone:"0300-12345"+(10+i),status:i%3?"Outpatient":"Admitted"}));
const DB={
patients:PT,
doctors:[["Dr. Imran Qureshi","Cardiology",18,3000,"Mon, Wed, Fri"],["Dr. Farah Nadeem","Pediatrics",12,2000,"Mon to Thu"],["Dr. Hamza Siddiqui","Orthopedics",15,2500,"Tue, Thu, Sat"],["Dr. Maryam Javed","Neurology",10,3500,"Mon, Wed"],["Dr. Saad Mirza","General Medicine",8,1500,"Mon to Sat"],["Dr. Laiba Anwar","Gynecology",14,2800,"Tue to Fri"]]
 .map((d,i)=>({id:i+1,name:d[0],spec:d[1],exp:d[2],fee:d[3],days:d[4],phone:"0321-77700"+(10+i),available:i%3!==2})),
appts:Array.from({length:8},(_,i)=>({id:i+1,pid:i+1,did:PT[i].did,date:day(i>>2),time:String(9+i).padStart(2,"0")+":00",status:["Pending","Confirmed","Completed"][i%3]})),
invoices:Array.from({length:6},(_,i)=>({id:1001+i,pid:i+1,date:day(-i),item:["Consultation","Lab tests","X-Ray","Surgery","Room charges","Medicines"][i],amount:[1500,3200,2500,45000,12000,1800][i],paid:i%2===0}))
};
