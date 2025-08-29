import React from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { countryCodes, CountryCode } from "../data/country-codes";

interface CountryCodeSelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  disabled?: boolean;
}

export const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({
  selectedCountry,
  onCountryChange,
  disabled = false,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-full min-w-[100px] justify-between border-r-0 rounded-r-none focus:ring-0 focus:ring-offset-0"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">
              {selectedCountry.dialCode}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[200px] max-h-[300px] overflow-y-auto"
      >
        {countryCodes.map(country => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => onCountryChange(country)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-base">{country.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{country.name}</span>
              <span className="text-xs text-muted-foreground">
                {country.dialCode}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
