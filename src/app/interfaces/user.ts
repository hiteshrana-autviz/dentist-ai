export interface User {
    id: string;                
    firstName: string;        
    lastName: string;          
    email: string;             
    userName: string;          
    passwordHash: string;      
    profileImage?: string;     
    roleId: string;            
    tenantId: string;         
    role: string;             
    isActive: boolean;        
  }
  
