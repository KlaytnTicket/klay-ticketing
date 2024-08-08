import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NavLogin(){
	// 로그인 닉네임 받기
  const [user, setUser] = useState(null); 
  const router = useRouter();

  useEffect(()=>{
    const storedUser = JSON.parse(localStorage.getItem('user'));
		setUser(storedUser);    
  }, []);

  const handleLogout = () =>{
		localStorage.removeItem('user');
		setUser(null);
		router.reload();
  };


  return(			      
      <div className="flex justify-end space-x-10 mr-5">        
        {user ?(
          <>
            <span>{user.nickname}</span>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원 가입</Link>
          </>
        )}
      </div>		
	);
}