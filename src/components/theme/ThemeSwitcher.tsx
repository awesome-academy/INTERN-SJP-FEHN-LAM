'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme} className='cursor-pointer'>
            {theme === 'light' ?
                <Sun className="h-[1.2rem] w-[1.2rem]" /> :
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            }
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
