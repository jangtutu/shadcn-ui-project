"use client";

import MDEditor from "@uiw/react-md-editor";
import { supabase } from "@/utils/supabase";
//Shadcn UI
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Labelcalender from "../calender/LabelCalender";
import { useToast } from "@/hooks/use-toast"
//CSS
import styles from "./MarkdownDialog.module.scss";
import { useState } from "react";


function MarkdownDialog() {
    const [title, setTitle] = useState<string>("");
    const [content,setContent] = useState<string | undefined>("**Hello, World!!**");
    const { toast } = useToast()

    const onSubmit = async () => {
        console.log("함수호출");
        if(!title||!content) {
            toast({
                title: "기입되지않은 데이터가 있습니다",
                description: "제목,날짜 혹은 콘텐츠 값을 모두 작성해주세요",
              });
              return;
        } else {
            //Supabase 데이터베이스에 연동
            const { data, error, status } = await supabase
                .from('todos')
                .insert([
                    { title: title, content: content },
                ])
                .select()

                if(error) {
                    console.log(error);
                    toast({
                        title: "에러가 발생했습니다",
                        description: "창에 출력된 에러를 확인해주세요",
                    });
                }
            if(status == 201) {
                toast({
                    title: "생성 완료!",
                    description: "올바르게 저장되었습니다.",
                });
            }
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                {/*<Button variant={"ghost"} className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Add Contents</Button>*/}
                <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Add Contents</span>
            </DialogTrigger>
            <DialogContent className="max-w-fit">
                <DialogHeader>
                    <DialogTitle>
                        <div className={styles.dialog__titleBox}>
                            <Checkbox className="w-5 h-5"/>
                            <input type="text" placeholder="Write a title for your board" className={styles.dialog__titleBox__title} onChange={(event)=>setTitle(event.target.value)}/>
                        </div>
                    </DialogTitle>
                    <div className={styles.dialog__calenderBox}>
                        <Labelcalender label="Form"/>
                        <Labelcalender label="To"/>
                    </div>
                    <Separator/>
                    <div className={styles.dialog__markdown}>
                        <MDEditor value={content} height={100 + "%"} onChange={setContent}/>
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <div className={styles.dialog__buttonBox}>
                        <DialogClose asChild>
                            <Button variant={"ghost"} className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500">Cancel</Button>
                        </DialogClose>
                        <Button type={"submit"} className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white" onClick={onSubmit}>Done</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MarkdownDialog