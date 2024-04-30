'use client'

import { IconOpenAI, IconUser, IconVercel } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'
import { PageSection } from '@/app/vectorsearch/route'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from '../ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { DocumentViewer } from '../document-view-sheet'
import { MarkdownWrapper } from '../markdown'
import { SupabaseAgent, SupabaseTag } from '@/types/supabase'
import { badgeStyle } from '../ui/badge'

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  )
}

export function VectorMessage({
  data,
  usage,
  agent,
  sections,
  tags,
  className
}: {
  // content: string | StreamableValue<string>
  data: any
  usage?: { prompt_tokens: number, completion_tokens: number, total_tokens: number }
  agent?: SupabaseAgent
  tags?: SupabaseTag[]
  sections?: PageSection[]
  className?: string
}) {
  const content = data.message.content
  const text = useStreamableText(content)

  return (
    <Sheet>
      <div className={cn('group relative flex items-start md:-ml-12', className)}>
        <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
          <IconVercel />
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className='border-none'>
              {/* <AccordionTrigger>Is it accessible?</AccordionTrigger> */}
              <div className="">
                <div className='flex justify-between'>
                  <div>VectorSearch Results:</div>
                  {sections && (<Tooltip>
                    <TooltipTrigger><AccordionTrigger className='hover:no-underline py-2'>💡</AccordionTrigger></TooltipTrigger>
                    <TooltipContent>
                      <p>Show sources</p>
                    </TooltipContent>
                  </Tooltip>)}
                </div>
              </div>
              <MarkdownWrapper text={text} />

              <AccordionContent>
                <div className='flex flex-wrap w-full my-3'>
                  {sections && (
                    sections.map((section, index) => (
                      <div key={index} className='mb-2 gap-x-1'>
                        {section.metadata?.fileName && <DocumentViewer name={section.metadata?.fileName!} source={section.metadata?.sourcePage!} section={section}>
                          <Badge className="text-xs cursor-pointer mr-1 mb-1">{section.metadata.fileName} @ P{section.metadata?.loc?.pageNumber ?? ""}</Badge>
                        </DocumentViewer>}
                        {/* <p className='text-xs text-gray-500'>Similarity score: {section.similarity}</p> */}
                      </div>
                    ))
                  )}
                </div>

                {usage && (
                  <div className="text-xs text-gray-500">
                    <p>
                      Prompt tokens: {usage.prompt_tokens}, Completion tokens:{' '}
                      {usage.completion_tokens}, Total tokens: {usage.total_tokens}
                    </p>
                  </div>
                )}

                {/* @ts-expect-error Type 'Json | undefined' is not an array type. ts(2461) */}
                {agent && agent?.tags?.length ? <div className='flex text-sm my-2'>
                  <span className='mr-5'>Used Agent: 🤖 {agent.name}</span>
                  {/* @ts-expect-error Type 'Json | undefined' is not an array type. ts(2461) */}
                  <div>{agent.tags.map(({ name, value, color }) => (
                    <Badge
                      key={value}
                      variant="outline"
                      style={badgeStyle(color)}
                      className="mr-1 mb-1"
                    >
                      {name}
                    </Badge>
                  ))}</div>
                </div> : null}

                {!agent && tags && tags.length ? <div className='flex text-sm my-2'>
                  <span className='mr-5'>Used Tags: </span>
                  <div>{tags.map(({ name, value, color }) => (
                    <Badge
                      key={value}
                      variant="outline"
                      style={badgeStyle(color)}
                      className="mr-1 mb-1"
                    >
                      {name}
                    </Badge>
                  ))}</div>
                </div> : null}

              </AccordionContent>

              {/* <SheetContent className='w-[500px]'>
                <ScrollArea className="size-full">
                  <SheetHeader className='mb-5'>
                    <SheetTitle>Sources</SheetTitle>
                    <SheetDescription>
                      The sources used to generate this answer.
                    </SheetDescription>
                  </SheetHeader>
                  {sections && (
                    sections.map((section, index) => (
                      <div key={index} className="text-xs space-y-2 mb-3">
                        <p>
                          Section {index + 1}: (Source: {section.metadata?.sourcePage ?? 'unknown'})
                        </p>
                        <p>{section.content}</p>
                        <p className='text-xs text-gray-500'>Similarity score: {section.similarity}</p>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </SheetContent> */}
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Sheet>
  )
}

export function BotMessage({
  content,
  className
}: {
  content: string | StreamableValue<string>
  className?: string
}) {
  const text = useStreamableText(content)

  return (
    <div className={cn('group relative flex items-start md:-ml-12', className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MarkdownWrapper text={text} />
      </div>
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage({ children, message }: { children?: React.ReactNode, message?: string }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      {/* <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div> */}
      <div className="ml-4 flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        <span className='mr-2'>{spinner}</span> <span>{message}</span>
        {children}
      </div>
    </div>
  )
}
