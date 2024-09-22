"use client";

import { useEffect, useState } from "react";
// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Dot, DotIcon, Search } from "lucide-react"
// CSS
import styles from "./SideNavigation.module.scss"
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "@/hooks/use-toast";

function SideNavigation() {
    
    const router = useRouter();
    const [todos, setTodos] = useState<any>([]);

    const onCreate = async() => {
        //supabase row생성
        const {error, status} = await supabase.from("todos").insert([
            {
                title: "",
                start_date: "",
                end_date: "",
                contents: [],
            },
        ]);
        if(error) {
            console.log(error);
        }
        if(status == 201) {
            toast({
                title: "페이지 생성완료",
                description: "새로운 투두리스트가 생성 되었습니다",
            });
            router.push("/create");
        }
    };

    // Supabase에 기존에 생성된 페이지가 있는지 없는지 확인
    const getTodos = async() => {
        let {data : todos, error, status} = await supabase.from("todos").select("*");

        if(status == 200) {
            setTodos(todos);
        }
    };

    useEffect(()=> {
        getTodos();
    }, []);

  return (
    <div className={styles.container}>{/*검색창*/}
        <div className={styles.container__searchBox}>
            <Input type="text" placeholder="검색어를 입력해주세요" className="focus-visible:ring-0"/>
            <Button variant={"outline"} size="icon">
                <Search className="w-4 h-4"/>
            </Button>
        </div>
        <div className={styles.container__buttonBox}>
            <Button variant={"outline"} className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500" onClick={onCreate}>Add New Page</Button>
        </div>
        <div className={styles.container__todos}>
            <span className={styles.container__todos__label}>Your To do</span>
            {/* Is Supabase Todos */}
            <div className={styles.container__todos__list}>
            {todos && todos.map((item:any) => {
                return(
                    <div className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer" key={item.id}>
                        <Dot className="mr-1 text-green-400"></Dot>
                        <span className="text-sm">{item.title == "" ? "제목없음" : item.title}</span>
                    </div>
                );
            })}
            </div>
        </div>
    </div>
  )
}

export default SideNavigation