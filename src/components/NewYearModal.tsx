import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Snowflake, PartyPopper } from "lucide-react";

const SESSION_KEY = "newYearModalShown";

export const NewYearModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyShown) {
      setIsOpen(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-primary via-primary/95 to-primary-dark border-none text-white">
        <DialogHeader className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            <Snowflake className="w-8 h-8 text-white/80 animate-pulse" />
            <PartyPopper className="w-8 h-8 text-yellow-300" />
            <Snowflake className="w-8 h-8 text-white/80 animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Уважаемые клиенты, С Новым Годом!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center py-4">
          <p className="text-lg font-medium text-white/90">
            Режим работы сайта ПРИЦЕП98 на Новогодние праздники:
          </p>
          
          <div className="space-y-3 bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-300 font-semibold">30 декабря с 16:00</span>
              <span className="text-white/80">– начало праздников!</span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-300 font-semibold">С 4 января</span>
              <span className="text-white/80">– работаем в стандартном режиме</span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-red-300 font-semibold">7 января</span>
              <span className="text-white/80">– Выходной день</span>
            </div>
          </div>
          
          <p className="text-white/70 text-sm italic">
            Желаем вам счастья, здоровья и отличных путешествий в новом году! 🎄
          </p>
        </div>
        
        <Button 
          onClick={() => setIsOpen(false)}
          className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
        >
          Понятно, спасибо!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
