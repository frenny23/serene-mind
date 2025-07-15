
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, Calendar as CalendarIcon, Trash2, Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  date: Date;
  mood: string;
  content: string;
  tags: string[];
}

const moodOptions = ["Great", "Good", "Okay", "Low", "Difficult"];

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("journalEntries");
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === "date") return new Date(value);
      return value;
    }) : [];
  });
  
  const [newEntry, setNewEntry] = useState<Omit<JournalEntry, "id">>({
    date: new Date(),
    mood: "Good",
    content: "",
    tags: [],
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = () => {
    if (!newEntry.content.trim()) {
      toast.error("Please write something in your journal entry");
      return;
    }
    
    const entry: JournalEntry = {
      ...newEntry,
      id: Date.now().toString(),
    };
    
    setEntries([entry, ...entries]);
    setNewEntry({
      date: new Date(),
      mood: "Good",
      content: "",
      tags: [],
    });
    
    toast.success("Journal entry saved successfully");
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast.success("Journal entry deleted");
  };

  const handleEditEntry = (entry: JournalEntry) => {
    if (editingId === entry.id) {
      setEditingId(null);
      setEntries(entries.map(e => e.id === entry.id ? { ...entry, content: entry.content } : e));
    } else {
      setEditingId(entry.id);
    }
  };

  const handleUpdateContent = (id: string, content: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, content } : entry
    ));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newEntry.tags.includes(newTag.trim())) {
      setNewEntry({
        ...newEntry,
        tags: [...newEntry.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const entriesForSelectedDate = entries.filter(entry => 
    format(entry.date, "yyyy-MM-dd") === format(selectedDate || new Date(), "yyyy-MM-dd")
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">Mood Journal</h1>
        
        <Tabs defaultValue="new" className="space-y-4">
          <TabsList>
            <TabsTrigger value="new" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </TabsTrigger>
            <TabsTrigger value="view">View Entries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Journal Entry</CardTitle>
                <CardDescription>
                  Record your thoughts and feelings to track your mental wellbeing over time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newEntry.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEntry.date ? format(newEntry.date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newEntry.date}
                        onSelect={(date) => setNewEntry({ ...newEntry, date: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">How are you feeling today?</label>
                  <Select 
                    value={newEntry.mood} 
                    onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map((mood) => (
                        <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Journal Entry</label>
                  <Textarea
                    placeholder="Write your thoughts here..."
                    className="min-h-[200px]"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddTag}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {newEntry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newEntry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddEntry}>Save Entry</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="view">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    // Highlight dates with entries
                    modifiers={{
                      hasEntry: entries.map(entry => new Date(entry.date)),
                    }}
                    modifiersClassNames={{
                      hasEntry: "bg-primary text-primary-foreground",
                    }}
                  />
                </CardContent>
              </Card>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4">
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                </h3>
                
                {entriesForSelectedDate.length === 0 ? (
                  <div className="bg-muted p-8 rounded-lg text-center">
                    <p className="text-muted-foreground">No entries for this date.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entriesForSelectedDate.map((entry) => (
                      <Card key={entry.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{format(entry.date, "h:mm a")}</CardTitle>
                            <CardDescription>Mood: {entry.mood}</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditEntry(entry)}
                            >
                              {editingId === entry.id ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {editingId === entry.id ? (
                            <Textarea
                              value={entry.content}
                              onChange={(e) => handleUpdateContent(entry.id, e.target.value)}
                              className="min-h-[100px]"
                            />
                          ) : (
                            <p className="whitespace-pre-wrap">{entry.content}</p>
                          )}
                          
                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {entry.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Journal;
