"use client";

import { supabase } from "@/utils/supabase";
import { usePathname } from "next/navigation";
import MarkdownDialog from "../dialog/MarkdownDialog";
// Shadcn UI
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
// CSS
import styles from "./BasicBoard.module.scss";
import { toast } from "@/components/ui/use-toast";

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
    startDate: string;
    endDate: string;
    content: string;
}
interface Props {
    data: BoardContent;
}

function BasicBoard({ data }: Props) {
    const pathname = usePathname();
    const handleDelete = async (id: string | number) => {
        // 해당 Board에 대한 데이터만 수정 혹은 삭제
        let { data: todos } = await supabase.from("todos").select("*");

        if (todos !== null) {
            todos.forEach(async (item: Todo) => {
                if (item.id === Number(pathname.split("/")[2])) {
                    console.log(item);

                    let newContents = item.contents.filter((element: BoardContent) => element.boardId !== id);

                    // Supabase 데이터베이스에 다시 저장
                    const { data, error, status } = await supabase
                        .from("todos")
                        .update({
                            contents: newContents,
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
                            title: "삭제가 완료되었습니다.",
                            description: "Supabase에서 올바르게 삭제되었습니다.",
                        });
                    }
                } else {
                    return;
                }
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.container__header}>
                <div className={styles.container__header__titleBox}>
                    <Checkbox className="w-5 h-5" />
                    {data.title !== "" ? <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{data.title}</h3> : <span className={styles.title}>It is filled in after the post is created.</span>}
                </div>
                <Button variant={"ghost"}>
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                </Button>
            </div>
            <div className={styles.container__body}>
                <div className={styles.container__body__calendarBox}>
                    <div className="flex items-center gap-3">
                        <span className="text-[#6d6d6d]">From</span>
                        <Input value={data.startDate !== "" ? data.startDate.split("T")[0] : "pick a date"} disabled />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[#6d6d6d]">To</span>
                        <Input value={data.endDate !== "" ? data.endDate.split("T")[0] : "pick a date"} disabled />
                    </div>
                </div>
                <div className={styles.container__body__buttonBox}>
                    <Button variant={"ghost"} className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500">
                        Duplicate
                    </Button>
                    <Button variant={"ghost"} className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500" onClick={() => handleDelete(data.boardId)}>
                        Delete
                    </Button>
                </div>
            </div>
            <div className={styles.container__footer}>
                <MarkdownDialog data={data} />
            </div>
        </div>
    );
}

export default BasicBoard;