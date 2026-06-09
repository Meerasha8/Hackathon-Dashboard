import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// ─── Hackathons ───────────────────────────────────────────────────────────────

export function useHackathons(filterCompleted = false) {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('hackathons')
      .select('*, phases(*)')
      .order('created_at', { ascending: false })

    if (filterCompleted === true) {
      query = query.eq('status', 'completed')
    } else if (filterCompleted === false) {
      query = query.neq('status', 'completed')
    }

    const { data, error } = await query
    if (error) { toast.error('Failed to load hackathons'); console.error(error) }
    else setHackathons(data || [])
    setLoading(false)
  }, [filterCompleted])

  useEffect(() => { fetch() }, [fetch])

  return { hackathons, loading, refetch: fetch }
}

export function useHackathon(id) {
  const [hackathon, setHackathon] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('hackathons')
      .select('*, phases(*)')
      .eq('id', id)
      .single()

    if (error) { toast.error('Failed to load hackathon'); console.error(error) }
    else {
      // Sort phases by order
      if (data?.phases) data.phases.sort((a, b) => a.order - b.order)
      setHackathon(data)
    }
    setLoading(false)
  }, [id])

  useEffect(() => { fetch() }, [fetch])

  return { hackathon, loading, refetch: fetch }
}

export async function createHackathon(data) {
  const { phases, ...hackathonData } = data
  const { data: hack, error } = await supabase
    .from('hackathons')
    .insert(hackathonData)
    .select()
    .single()

  if (error) throw error

  if (phases && phases.length > 0) {
    const phasesWithId = phases.map((p, i) => ({ ...p, hackathon_id: hack.id, order: i }))
    const { error: phaseErr } = await supabase.from('phases').insert(phasesWithId)
    if (phaseErr) throw phaseErr
  }

  return hack
}

export async function updateHackathon(id, data) {
  const { phases, ...hackathonData } = data
  const { error } = await supabase
    .from('hackathons')
    .update(hackathonData)
    .eq('id', id)

  if (error) throw error
}

export async function deleteHackathon(id) {
  const { error } = await supabase.from('hackathons').delete().eq('id', id)
  if (error) throw error
}

// ─── Phases ───────────────────────────────────────────────────────────────────

export async function createPhase(hackathonId, phaseData, order) {
  const { data, error } = await supabase
    .from('phases')
    .insert({ ...phaseData, hackathon_id: hackathonId, order })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePhase(id, data) {
  const { error } = await supabase.from('phases').update(data).eq('id', id)
  if (error) throw error
}

export async function deletePhase(id) {
  const { error } = await supabase.from('phases').delete().eq('id', id)
  if (error) throw error
}

export async function togglePhaseComplete(id, current) {
  const { error } = await supabase
    .from('phases')
    .update({ is_completed: !current })
    .eq('id', id)
  if (error) throw error
}
