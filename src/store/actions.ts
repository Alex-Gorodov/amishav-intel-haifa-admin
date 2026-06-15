import { createAction } from "@reduxjs/toolkit";
import { Role, User } from "../types/User";
import { Availability } from "../types/Availability";
import { Document } from "../types/Document";
import { GiveShiftRequest, RequestStatus, SwapShiftRequest } from "../types/Request";
import { Shift } from "../types/Shift";
import { Training } from "../types/Training";
import { Protocol, ProtocolPreview } from "../types/Protocol";
import { Post } from "../types/Post";

export const setUsersDataLoading = createAction<{isUsersDataLoading: boolean}>('data/setUsersDataLoading');
export const loadUsers = createAction<{users: User[]}>('data/loadUsers');

export const loadProtocolsPreview = createAction<{protocolsPreview: ProtocolPreview[]}>('data/loadProtocolsPreview')
export const loadProtocols = createAction<{protocols: Protocol[]}>('data/loadProtocols')
export const deleteProtocol = createAction<{protocolId: string}>('data/deleteProtocol')

export const setRequestsDataLoading = createAction<{isRequestsDataLoading: boolean}>('data/setRequestsDataLoading');
export const loadRequests = createAction<{type: 'swap' | 'give', requests: SwapShiftRequest[] | GiveShiftRequest[]}>('data/loadRequests');

export const setSecurityPostsDataLoading = createAction<{isPostsDataLoading: boolean}>('data/setPostsDataLoading');
export const loadSecurityPosts = createAction<{posts: Post[]}>('data/loadPosts');

export const setControllCenterPostsDataLoading = createAction<{isPostsDataLoading: boolean}>('data/setControllCenterPostsDataLoading');
export const loadControllCenterPosts = createAction<{posts: Post[]}>('data/loadControllCenterPosts');

export const setDertPostsDataLoading = createAction<{isPostsDataLoading: boolean}>('data/setDertPostsDataLoading');
export const loadDertPosts = createAction<{posts: Post[]}>('data/loadDertPosts');

export const addEmployee = createAction<{user: User}>('data/addEmployee');
export const deleteEmployee = createAction<{userId: string}>('data/deleteEmployee');

export const addShift = createAction<{shift: Shift}>('data/addShift');

export const addProtocol = createAction<{protocol: Protocol}>('data/addProtocol');

export const setAvailability = createAction<{user: User, availability: Availability[]}>('data/setAvailability');

export const uploadDocument = createAction<{user: User, document: Document}>('data/uploadDocument');

export const sendSwapShiftRequest = createAction<{firstUser: User, secondUser: User, firstUserShiftId: string, secondUserShiftId: string}>('data/SwapShiftRequest');

export const confirmShiftRequest = createAction<{request: SwapShiftRequest | GiveShiftRequest}>('data/confirmShiftRequest');

export const rejectShiftRequest = createAction<{request: SwapShiftRequest | GiveShiftRequest}>('data/rejectShiftRequest');

export const sendGiveShiftRequest = createAction<{fromUser: User, toUser: User, shiftId: string}>('data/giveShiftRequest');

export const setRequestStatus = createAction<{id: string, status: RequestStatus}>('requests/setStatus');

export const removeRequest = createAction<string>('requests/remove');

export const setStateError = createAction<{message: string | null}>('app/setStateError')

export const setStateSuccess = createAction<{message: string | null}>('app/setStateSuccess')

export const setUserShifts = createAction<{userId: string, shifts: Shift[]}>('data/setUserShifts');

export const setTrainingUpdatingDate = createAction<{userId: string, training: Training, date: Date}>('data/setTrainingUpdatingDate')

export const setGuestMode = createAction<{isGuestMode: boolean}>('app/setGuestMode');

export const addUserRole = createAction<{userId: string, role: Role}>('data/addUserRole');
export const removeUserRole = createAction<{userId: string, role: Role}>('data/removeUserRole');
