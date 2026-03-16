import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Block {
  id: string;
  name: string;
  code: string;
}

interface NoticeFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  priorityFilter?: string;
  onPriorityChange?: (priority: string) => void;
  departmentFilter?: string;
  onDepartmentChange?: (department: string) => void;
  blockFilter?: string;
  onBlockChange?: (block: string) => void;
  blocks?: Block[];
  readStatusFilter: string;
  onReadStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  departments: Department[];
  activeFiltersCount: number;
  onClearFilters: () => void;
}

const NoticeFilters = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  departmentFilter,
  onDepartmentChange,
  blockFilter,
  onBlockChange,
  blocks,
  readStatusFilter,
  onReadStatusChange,
  sortBy,
  onSortChange,
  departments,
  activeFiltersCount,
  onClearFilters,
}: NoticeFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card/60 backdrop-blur-sm border-border/30"
          />
        </div>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-40 bg-card/60 border-border/30">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        {/* Mobile Filters Popover */}
        <div className="sm:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <FilterSelects
                categoryFilter={categoryFilter}
                onCategoryChange={onCategoryChange}
                priorityFilter={priorityFilter}
                onPriorityChange={onPriorityChange}
                departmentFilter={departmentFilter}
                onDepartmentChange={onDepartmentChange}
                blockFilter={blockFilter}
                onBlockChange={onBlockChange}
                blocks={blocks}
                readStatusFilter={readStatusFilter}
                onReadStatusChange={onReadStatusChange}
                departments={departments}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Desktop Filters Row */}
      <div className="hidden sm:flex flex-wrap gap-3 items-center">
        <FilterSelects
          categoryFilter={categoryFilter}
          onCategoryChange={onCategoryChange}
          priorityFilter={priorityFilter}
          onPriorityChange={onPriorityChange}
          departmentFilter={departmentFilter}
          onDepartmentChange={onDepartmentChange}
          readStatusFilter={readStatusFilter}
          onReadStatusChange={onReadStatusChange}
          departments={departments}
        />

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

interface FilterSelectsProps {
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  priorityFilter?: string;
  onPriorityChange?: (priority: string) => void;
  departmentFilter?: string;
  onDepartmentChange?: (department: string) => void;
  blockFilter?: string;
  onBlockChange?: (block: string) => void;
  blocks?: Block[];
  readStatusFilter: string;
  onReadStatusChange: (status: string) => void;
  departments: Department[];
}

const FilterSelects = ({
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  departmentFilter,
  onDepartmentChange,
  blockFilter,
  onBlockChange,
  blocks,
  readStatusFilter,
  onReadStatusChange,
  departments,
}: FilterSelectsProps) => (
  <>
    <Select value={categoryFilter} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-full sm:w-36 bg-card/60 border-border/30">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        <SelectItem value="exam">Exam</SelectItem>
        <SelectItem value="events">Events</SelectItem>
        <SelectItem value="class">Class</SelectItem>
        <SelectItem value="general">General</SelectItem>
      </SelectContent>
    </Select>

    <Select value={priorityFilter || 'all'} onValueChange={onPriorityChange || (() => {})}>
      <SelectTrigger className="w-full sm:w-32 bg-card/60 border-border/30">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Priority</SelectItem>
        <SelectItem value="critical">Critical</SelectItem>
        <SelectItem value="high">High</SelectItem>
        <SelectItem value="normal">Normal</SelectItem>
        <SelectItem value="low">Low</SelectItem>
      </SelectContent>
    </Select>

    {departmentFilter !== undefined && (
      <Select value={departmentFilter} onValueChange={onDepartmentChange || (() => {})}>
        <SelectTrigger className="w-full sm:w-44 bg-card/60 border-border/30">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {(departments || []).map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.code} - {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}

    {blockFilter !== undefined && (
      <Select value={blockFilter} onValueChange={onBlockChange || (() => {})}>
        <SelectTrigger className="w-full sm:w-44 bg-card/60 border-border/30">
          <SelectValue placeholder="Block" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Blocks</SelectItem>
          {(blocks || []).map((block) => (
            <SelectItem key={block.id} value={block.id}>
              {block.code} - {block.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}

    <Select value={readStatusFilter} onValueChange={onReadStatusChange}>
      <SelectTrigger className="w-full sm:w-32 bg-card/60 border-border/30">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="unread">Unread</SelectItem>
        <SelectItem value="read">Read</SelectItem>
      </SelectContent>
    </Select>
  </>
);

export default NoticeFilters;
