export interface Profile {
    ID:                 string;
    ProfileType:		string; 
	//ProfileImage: 		string;  TODO: Ability to add profile image using aws s3 buckets
	Status: 			string;  
	AverageScore:		number;  
	Bio: 				string;  
	PlayStyle: 			string;
}