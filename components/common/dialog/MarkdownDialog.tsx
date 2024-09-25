"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase";
// Components
import LabelCalendar from "../calendar/LabelCalendar";
import MDEditor from "@uiw/react-md-editor";
// Shadcn UI
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
// CSS
import styles from "./MarkdownDialog.module.scss";

interface Todo {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    contents: BoardContent[];
}
interface BoardContent {
    boardId: string | number;
    isCompleted: boolean;
    title: string;
    startDate: String | Date;
    endDate: String | Date;
    content: string;
}
interface Props {
    data: BoardContent;
}

function MarkdownDialog({ data }: Props) {
    const pathname = usePathname();

    const [open, setOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());
    const [content, setContent] = useState<string | undefined>("**Hello, World!!**");
    const { toast } = useToast();

    // ==========================================================================================

    // Supabase에 저장
    const onSubmit = async () => {
        console.log("함수 호출");

        if (!title || !startDate || !endDate || !content) {
            toast({
                title: "기입되지 않은 데이터(값)가 있습니다.",
                description: "제목, 날짜 혹은 콘텐츠 값을 모두 작성해주세요.",
            });
            return;
        } else {
            // 해당 Board에 대한 데이터만 수정
            let { data: todos } = await supabase.from("todos").select("*");

            if (todos !== null) {
                todos.forEach(async (item: Todo) => {
                    if (item.id === Number(pathname.split("/")[2])) {
                        console.log(item);

                        item.contents.forEach((element: BoardContent) => {
                            if (element.boardId === "-0XSbCBnPV8VK6p0HKnV3") {
                                element.content = content;
                                element.title = title;
                                element.startDate = startDate;
                                element.endDate = endDate;
                            } else {
                                element.content = element.content;
                                element.title = element.title;
                                element.startDate = element.startDate;
                                element.endDate = element.endDate;
                            }
                        });

                        // Supabase 데이터베이스에 연동
                        const { data, error, status } = await supabase
                            .from("todos")
                            .update({
                                contents: item.contents,
                            })
                            .eq("id", pathname.split("/")[2]);

                        if (error) {
                            console.log(error);
                            toast({
                                title: "에러가 발생했습니다.",
                                description: "콘솔 창에 출력된 에러를 확인하세요.",
                            });
                        }
                        if (status === 204) {
                            toast({
                                title: "수정 완료!",
                                description: "작성한 글이 Supabase에 올바르게 저장되었습니다.",
                            });

                            // 등록 후 조건 초기화
                            setOpen(false);
                        }
                    } else {
                        return;
                    }
                });
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {data.title ? (
                <DialogTrigger asChild>
                    <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Update Contents</span>
                </DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">Add Contents</span>
                </DialogTrigger>
            )}
            <DialogContent className="max-w-fit">
                <DialogHeader>
                    <DialogTitle>
                        <div className={styles.dialog__titleBox}>
                            <Checkbox className="w-5 h-5" />
                            <input type="text" placeholder="Write a title for your board." className={styles.dialog__titleBox__title} onChange={(event) => setTitle(event.target.value)} />
                        </div>
                    </DialogTitle>
                    <div className={styles.dialog__calendarBox}>
                        <LabelCalendar label="From" handleDate={setStartDate} />
                        <LabelCalendar label="To" handleDate={setEndDate} />
                    </div>
                    <Separator />
                    <div className={styles.dialog__markdown}>
                        <MDEditor value={content} height={100 + "%"} onChange={setContent} />
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <div className={styles.dialog__buttonBox}>
                        <DialogClose asChild>
                            <Button variant={"ghost"} className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type={"submit"} className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white" onClick={onSubmit}>
                            Done
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default MarkdownDialog;