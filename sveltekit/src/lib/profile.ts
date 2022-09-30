export interface Profile {
    ID:                 string;
    ProfileType:		string; 
	Name:               string;
	LastActive: 		number;  	
	//ProfileImage: 		string;  TODO: Ability to add profile image using aws s3 buckets
	Status: 			string;  
	AverageScore:		number;  
	Age: 				number;
    Gender:             number;
	Bio: 				string;  
	PlayStyle: 			number;
}